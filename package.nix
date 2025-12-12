{ config, lib, pkgs, ags, astal, ... }:

{
  perSystem = { system, self', pkgs, lib, ... }:
    let
      packageName = "bathud";
      
      # Extract the system-specific Astal package set
      astalPackages = astal.packages.${system};

      bundledApp = 
	# --- FIX: Start 'with' here to bring 'pkgs' and 'astalPackages' into scope ---
        with pkgs;
        with astalPackages;
        
        let
          # Now, all these variables are defined in the 'with' scope:
          allRuntimeDeps = [
            astal3      # astalPackages.astal3
            astal4      # astalPackages.astal4
            pipewire    # pkgs.pipewire
            networkmanager # pkgs.networkmanager
            bluez       # pkgs.bluez
            gtk4        # pkgs.gtk4
          ];
        in
        stdenv.mkDerivation {
          pname = packageName;
          version = "0.1.0";

          # Source is the current directory (project root)
          src = ./.; 

          nativeBuildInputs = [
            ags.packages.${system}.default
            makeWrapper
          ];

          # Runtime dependencies are clean due to 'with pkgs'
	  buildInputs = allRuntimeDeps;
          
          buildPhase = ''
            echo "Running simple ags bundle command..."
            ags bundle
            
            if [ ! -d "dist" ]; then
              echo "ERROR: 'ags bundle' did not create the expected 'dist' output directory."
              exit 1
            fi
          '';

          installPhase = ''
            # 1. Copy bundled assets from 'dist' to the AGS config directory
            mkdir -p $out/share/ags/js
            cp -r dist/* $out/share/ags/js/

            # 2. Create the executable wrapper
            mkdir -p $out/bin
            
            makeWrapper ${ags.packages.${system}.default}/bin/ags $out/bin/${packageName} \
              --add-path "${lib.makeBinPath allRuntimeDeps}" \
              --run "export AGS_CONFIG_DIR=$out/share/ags/js"
          '';
        };
    in
    {
      packages.default = bundledApp;

      apps.default = {
        type = "app";
        program = "${bundledApp}/bin/${packageName}";
      };
      #nix run . -- marco
    };
}
