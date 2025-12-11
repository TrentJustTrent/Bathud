{
  description = "A Nix flake for a TypeScript project using AGS and Astal.";

  inputs = {
    # Nixpkgs provides the standard packages and environment
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    # Flake-parts for modular flake structure
    flake-parts.url = "github:hercules-ci/flake-parts";

    # Aylur's AGS (A Glorious Shell) and Astal
    ags.url = "github:Aylur/ags";
    ags.inputs.nixpkgs.follows = "nixpkgs";
    ags.inputs.astal.follows = "astal";

    astal.url = "github:Aylur/astal";
    astal.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake {
      inherit inputs;
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
    } {
      # Pass required inputs to the package.nix module via specialArgs
      imports = [
        ({ inputs, ... }: {
          perSystem = { pkgs, system, ... }: {
            _module.args = {
              inherit (inputs) ags astal;
            };
          };
        })
        # Load the main package definition
        ./package.nix
      ];
    };
}