#!/bin/sh
# Replace VITE_API_URL in JS bundle
if [ -n "$VITE_API_URL" ]; then
  echo "Replacing VITE_API_URL with $VITE_API_URL"
  find /usr/share/nginx/html/assets -type f -name '*.js' -exec sed -i "s|__VITE_API_URL__|$VITE_API_URL|g" {} +
fi

exec "$@"
