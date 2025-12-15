{ config, lib, pkgs, ags, astal, awww, ... }:

{
  perSystem = { system, self', pkgs, lib, ... }:
    let
      packageName = "bathud";
      
      # Define the name of the final bundled JavaScript file
      bundledOutputName = "bathud.js";
      
      ap = astal.packages.${system};
      aw = awww.packages.${system};
      
      bathud = 
        
        let
          allRuntimeDeps = [
            pkgs.glib
            pkgs.gjs
            pkgs.networkmanager
            pkgs.bluez
            pkgs.sox
            pkgs.brightnessctl
            pkgs.cava
            pkgs.cliphist
            pkgs.dart-sass
            pkgs.yq-qo
            pkgs.grim
            pkgs.gvfs
            pkgs.jq
            pkgs.libnotify
            pkgs.pipewire-pulse
            pkgs.power-profiles-daemon
            pkgs.slurp
            pkgs.sox
            pkgs.upower
            pkgs.wf-recorder
            pkgs.wl-clipboard 
            aw.awww
            pkgs.gtk4
            pkgs.pipewire
            ap.io
            ap.astal3
            ap.astal4
            ap.wireplumber
          ];
        in
        
        pkgs.stdenvNoCC.mkDerivation {
          pname = packageName;
          version = "0.1.0";

          src = ./.; 

          nativeBuildInputs = [
            pkgs.wrapGAppsHook4
            pkgs.gobject-introspection
            ags.packages.${system}.default
          ];

          buildInputs = allRuntimeDeps;
          
          buildPhase = ''
            echo "Running precise ags bundle command..."
            
            # --- FIX: Use the confirmed syntax ---
            # ags bundle [entryfile] [outfile] [flags]
            # Use -r . to set the project root correctly for the bundler
            # Use -p to include packages defined in package.json (if applicable)
            ags bundle src/app.ts ${bundledOutputName} -r . -d "SRC='${./src}'"
            
            # Note: The output is a file, not a directory, so no directory check is needed.
          '';

          installPhase = ''
            # 1. Create the target directory for the config file
            mkdir -p $out/share/ags/js
            
            # 2. FIX: Copy the single bundled file to the final location
            cp ${bundledOutputName} $out/share/ags/js/config.js

            # 3. Create the executable wrapper
            mkdir -p $out/bin
            
            makeWrapper ${ags.packages.${system}.default}/bin/ags $out/bin/${packageName}
              --set PATH "${lib.makeBinPath allRuntimeDeps}"
              --set AGS_CONFIG_DIR "$out/share/ags/js"
          '';
        };
    in
    {
      packages.default = bathud;

      apps.default = {
        type = "app";
        program = "${bathud}/bin/${packageName}";
      };
    };
}