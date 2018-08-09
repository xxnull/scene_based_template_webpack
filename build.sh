for d in src/* ; do
    DIR="${d//src\/}"
    if [ $DIR != "assets" ] && [ $DIR != "index.html" ] && [ $DIR != "iframe.html" ]
    then
        echo "\n"
        echo "/**************************************"
        echo " *"
        echo " * Build exp: $DIR"
        echo " *"
        echo "/**************************************"
        npm run build:pro -- --env.exp $DIR
    fi
done

echo "\n\n Build finished."