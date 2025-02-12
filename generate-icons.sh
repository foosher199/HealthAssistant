#!/bin/bash

# 确保 images 目录存在
mkdir -p images

# 定义要生成的图标尺寸
sizes=(16 32 48 128)

# 检查 Inkscape 是否安装
if ! command -v inkscape &> /dev/null; then
    echo "错误: 需要安装 Inkscape"
    echo "Ubuntu/Debian: sudo apt-get install inkscape"
    echo "MacOS: brew install inkscape"
    exit 1
fi

# 为每个尺寸生成图标
for size in "${sizes[@]}"; do
    echo "生成 ${size}x${size} 图标..."
    inkscape --export-type="png" \
             --export-filename="images/icon${size}.png" \
             --export-width=$size \
             --export-height=$size \
             "images/icon.svg"
done

echo "图标生成完成！" 