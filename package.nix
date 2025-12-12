{ config, lib, pkgs, ags, astal, ... }:

{
  perSystem = { system, self', pkgs, lib, ... }:
    let
      packageName = "your-typescript-project-ags";
      
      # Define the name of the final bundled JavaScript file
      bundledOutputName = "shell.js";
      
      astalPackages = astal.packages.${system};
      
      tsAgsBundle = 
        with pkgs;
        with astalPackages;
        
        let
          allRuntimeDeps = [
            astal3
            astal4
            pipewire
            networkmanager
            bluez
            gtk4
          ];
        in
        
        stdenv.mkDerivation {
          pname = packageName;
          version = "0.1.0";

          src = ./.; 

          nativeBuildInputs = [
            ags.packages.${system}.default
            makeWrapper
          ];

          buildInputs = allRuntimeDeps;
          
          buildPhase = ''
            echo "Running precise ags bundle command..."
            
            # --- FIX: Use the confirmed syntax ---
            # ags bundle [entryfile] [outfile] [flags]
            # Use -r . to set the project root correctly for the bundler
            # Use -p to include packages defined in package.json (if applicable)
            ags bundle src/main.ts ${bundledOutputName} -r . -p
            
            # Note: The output is a file, not a directory, so no directory check is needed.
          '';

          installPhase = ''
            # 1. Create the target directory for the config file
            mkdir -p $out/share/ags/js
            
            # 2. FIX: Copy the single bundled file to the final location
            cp ${bundledOutputName} $out/share/ags/js/config.js

            # 3. Create the executable wrapper
            mkdir -p $out/bin
            
            makeWrapper ${ags.packages.${system}.default}/bin/ags $out/bin/${packageName} \
              --add-path "${lib.makeBinPath allRuntimeDeps}" \
              --run "export AGS_CONFIG_DIR=$out/share/ags/js"
          '';
        };
    in
    {
      packages.default = tsAgsBundle;

      apps.default = {
        type = "app";
        program = "${tsAgsBundle}/bin/${packageName}";
      };
    };
}