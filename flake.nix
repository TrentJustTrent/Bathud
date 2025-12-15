{
  description = "A Nix flake for a TypeScript project using AGS and Astal.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    
    ags.url = "github:Aylur/ags";
    ags.inputs.nixpkgs.follows = "nixpkgs";
    ags.inputs.astal.follows = "astal";

    astal.url = "github:Aylur/astal";
    astal.inputs.nixpkgs.follows = "nixpkgs";

    awww.url = "git+https://codeberg.org/LGFae/awww";
  };

  # Use destructuring to access the inputs needed for argument passing
  outputs = inputs@{ flake-parts, ags, astal, awww, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];

      # --- THE FIX IS HERE: Move _module.args to the top-level scope ---
      imports = [
        ({ ... }: {
          # Define args at the top level of the flake-parts configuration
          _module.args = {
            inherit ags astal awww;
          };
        })
        # Load the main package definition
        ./package.nix
      ];
      # ------------------------------------------------------------------
    };
}
