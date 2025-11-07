{
  lib,
  config,
  ags,
  astal,
  bluez,
  bluez-tools,
  brightnessctl,
  cliphist,
  dart-sass,
  glib,
  glib-networking,
  gnome-bluetooth,
  gpu-screen-recorder,
  gpustat,
  grimblast,
  gvfs,
  hyprpicker,
  libgtop,
  libnotify,
  networkmanager,
  nix-update-script,
  stdenvNoCC,
  swww,
  wireplumber,
  wf-recorder,
  wl-clipboard,
  writeShellScript,
  grim,
  yq-go,
  slurp,
  sox,
  jq,
  pipewire-pulse,
}:
stdenvNoCC.mkDerivation {
  pname = "bathud";
  version = "1.0.0";

  # The astal library is a build input.
  # buildInputs = [ astal ];
  nativeBuildInputs = [
    ags
    makeWrapper
  ];

  buildInputs = with astal; [
    io
    gjs
    astal4
  ];
  installPhase = ''
    mkdir -p $out/bin
    ags bundle app.ts $out/bin/${pname}.js -d "SRC='${./src}'"
    cat > $out/bin/${pname} << EOF
    #!/bin/sh
    exec ags run $out/bin/${pname}.js "\$@"
    EOF
    chmod +x $out/bin/${pname}
  '';

  preFixup = ''
    wrapProgram $out/bin/${pname} \
    --prefix PATH ':' ${
      lib.makeBinPath [
        bluez
        bluez-tools
        brightnessctl
        dart-sass
        grim
        yq-go
        slurp
        sox
        grimblast
        gvfs
        hyprpicker
        libgtop
        libnotify
        jq
        pipewire-pulse
        networkmanager
        swww
        wireplumber
        wf-recorder
        wl-clipboard
      ]
    }
  '';
  # The astal input is automatically available in the environment
  # during the build phase. The path is handled by Nix.
  meta = {
    description = "Bar/Panel for Hyprland with extensive customizability";
    homepage = "https://github.com/Jas-SinghFSU/HyprPanel";
    license = lib.licenses.mit;
    mainProgram = "bathud";
    platforms = lib.platforms.linux;
  };
}