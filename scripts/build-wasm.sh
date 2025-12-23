#!/usr/bin/env bash

SUBMODULE_DIR="modules/GradeSolver"
BUILD_DIR="$SUBMODULE_DIR/build-wasm"
OUTPUT_DIR="static/wasm"

mkdir -p $BUILD_DIR
mkdir -p $OUTPUT_DIR

echo "Configurando CMake con Emscripten..."
emcmake cmake -S $SUBMODULE_DIR -B $BUILD_DIR \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_CXX_STANDARD=20

echo "Compilando WASM..."
cmake --build $BUILD_DIR --target solver_wasm -j$(nproc)

echo "Copiando artefactos a static/wasm..."
cp $BUILD_DIR/src/bindings/solver.js $OUTPUT_DIR/
cp $BUILD_DIR/src/bindings/solver.wasm $OUTPUT_DIR/

echo "¡Listo!"
