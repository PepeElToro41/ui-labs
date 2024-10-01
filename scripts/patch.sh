
dependency=$(sed -n '/\[dependencies\]/,/^\[/{/^\[/!p}' wally.toml | grep "$1" | sed 's/.*= "\(.*\)"/\1/')


if [ -z "$dependency" ]; then
  echo "Dependency '$1' not found in wally.toml"
  exit 1
fi


wally-patch-package "$dependency"
