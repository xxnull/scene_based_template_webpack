for DIR in $(echo $1 | sed -n 1'p' | tr ',' '\n') ; do
    npm run build:pro -- --env.exploration $DIR;
    cp -r dist/$DIR ../build;
done

echo "\n\n Build finished."
