#!/bin/bash

cliphist_filter() {
    # Get clipboard types
    types=$(wl-paste --list-types)

    # Only process if plain text is available
    if ! echo "$types" | grep -qx "text/plain"; then
        echo "[cliphist] Skipped: no text/plain in clipboard (types: $types)" >&2
        return
    fi

    data="$(wl-paste --no-newline)"

    # Skip empty or whitespace-only entries
    [[ -z "$data" || "$data" =~ ^[[:space:]]*$ ]] && return

    # Trim surrounding whitespace
    data="$(echo "$data" | xargs)"

    # Basic filters: known token formats, keys, JWTs, PEM, "password"
    if [[ "$data" =~ ^[A-Za-z0-9]{32,}$ ]] ||
       [[ "$data" =~ ^sk-[A-Za-z0-9]{20,}$ ]] ||
       [[ "$data" =~ ^gh[pousr]_[A-Za-z0-9]{30,}$ ]] ||
       [[ "$data" =~ ^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ ]] ||
       [[ "$data" =~ "-----BEGIN PRIVATE KEY-----" ]] ||
       [[ "$data" =~ [Pp]assword ]] ||
       [[ ${#data} -gt 500 ]]; then
        echo "[cliphist] Skipped: known sensitive pattern" >&2
        return
    fi

    # Password-like content: 8–32 characters, no spaces, and mixed content
    if [[ ${#data} -ge 8 && ${#data} -le 32 ]] &&
       [[ "$data" =~ ^[[:graph:]]+$ ]] &&                       # All visible (non-space) characters
       [[ "$data" =~ [A-Za-z] ]] &&                            # Contains letters
       {
         [[ "$data" =~ [0-9] && "$data" =~ [^A-Za-z0-9] ]] ||  # letters + digits + special
         [[ "$data" =~ [0-9] ]] ||                             # letters + digits
         [[ "$data" =~ [^A-Za-z0-9] ]]                         # letters + special
       }; then
        echo "[cliphist] Skipped: likely password (8–32 chars, no space, mixed content)" >&2
        return
    fi

    echo "$data" | cliphist store
}

# Export the function so it's available in the child shell
export -f cliphist_filter

# Run the function every time clipboard changes
CLIPHIST_MAX_ITEMS=50 wl-paste --watch bash -c cliphist_filter
