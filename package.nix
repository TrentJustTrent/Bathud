{ config, lib, pkgs, ags, astal, ... }:

{
  perSystem = { system, self', pkgs, lib, ... }:
    let
      packageName = "your-typescript-project-ags";
      
      # Define the name of the final bundled JavaScript file
      bundledOutputName = "shell.js";
      
      astalPackages = astal.packages.${system};
      agsPackages = ags.packages.${system};
      agsDependencies = with agsPackages; [
        hyprland
        mpris
        battery
        wireplumber
        network
        bluetooth
        powerprofiles
        notifd
        apps
      ];
      systemDeps = with pkgs; [
        iio-hyprland
        hyprsunset
        slurp
        grim
        brightnessctl
        libnotify
        wlinhibit
        wl-clipboard
        libnotify
      ];
      bundle = ags.lib.bundle {
        inherit pkgs;
        extraPackages = agsDependencies ++ systemDeps;
        src = ./src;
        name = "tokyo-shell";
        entry = "app.ts";
        gtk4 = true;
      };
    in
    {
      packages.default = tsAgsBundle;

      apps.default = {
        type = "app";
        program = bundle;
      };
    };
}