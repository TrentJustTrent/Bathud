{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs@{ flake-parts, ags, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-linux" ]; # Add other systems as needed

      perSystem = { pkgs, ... }: {
        packages = {
          # Define your package here
          default = pkgs.callPackage ./package.nix {};
          #default = bathud;
        };
        apps = {
          default = {
            type = "app";
            program = "${pkgs.bathud}/bin/bathud";
          };
          #default = bathud-bin;
        };
      };
    };
}
# nix build .#hello