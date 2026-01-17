{ packages ? import <nixpkgs> {} }:
packages.mkShell {
  buildInputs = with packages; [
    git
    curl
    wget
    vim
    tmux
    zip
    unzip
  ];
  # ホスト環境から完全に分離する
  pure = true;
  shellHook = ''
    # Git safe.directory 設定（コンテナ環境対応）
    git config --global --add safe.directory /srv 2>/dev/null || true
    git config --global --add safe.directory "$(pwd)" 2>/dev/null || true

    echo "Welcome to the common development environment"
  '';
}
