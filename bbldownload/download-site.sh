#! /bin/bash

if [ $# -eq 0 ]; then
    echo "Error: Must provide hostname of BBL site as argument (e.g. https://tloeg.bbleague.se/)"
    exit 1
fi

SITE=$1

wget --config=wget.ini --recursive --page-requisites --convert-links --wait=3 --directory-prefix=bbl-site/ $SITE
