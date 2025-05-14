# Configuration System

OkPanel supports flexible configuration with multiple .conf files, allowing you to define global overrides and easily switch between themes or setups.

## Config File Locations

All config files are located in:

`~/.config/OkPanel/`

You can include any number of .conf files in this directory.

## Default Value Resolution

Each configuration field has a built-in default. When a value is not explicitly defined, OkPanel resolves the value using the following priority:

1. Active config file (e.g., nord.conf)

2. Global override file (okpanel.conf)

3. Built-in default value (defined by the schema)

## Global Overrides

You can define shared settings in a global file:

`~/.config/OkPanel/okpanel.conf`

This file acts as a fallback for all named configurations and is useful for setting values you want consistent across multiple themes or setups.

##  Switching Configurations

You can switch between config files using the Look & Feels widget in the UI.

⚠ Notes

- When you select a named config file like nord.conf, the okpanel.conf file will still be used as a fallback.

- If you only define values in okpanel.conf, and do not use any named configs, those values will apply globally.

- The okpanel.conf file must be named exactly as shown — no extensions or alternate names.