#!/bin/sh
# Maven wrapper script - downloads and runs Maven without installation
MAVEN_VERSION="3.9.6"
MAVEN_HOME="$HOME/.m2/wrapper/dists/apache-maven-$MAVEN_VERSION"
MVN_CMD="$MAVEN_HOME/bin/mvn"

if [ ! -f "$MVN_CMD" ]; then
    mkdir -p "$MAVEN_HOME"
    curl -sL "https://dlcdn.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz" | tar xz -C "$MAVEN_HOME" --strip-components=1
fi

exec "$MVN_CMD" "$@"
