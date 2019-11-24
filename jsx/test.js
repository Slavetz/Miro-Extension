let options = {
    env: 'ILST',
    path: '/Users/zoich/Library/Application Support/Adobe/CEP/extensions/Miro-Extension/temp/ILST/',
    scale: '1'
};

let save = exportPages(options);

function exportPages(options){

    let pages;
    let env = options.env;
    let path = options.path;
    let scale = options.scale;

    /** Получаем страницы */
    if (env === 'IDSN'){
        pages = getPagesObjectFromInDesign(scale);
    } else if (env === 'ILST'){
        pages = getPagesObjectFromIllustrator(scale);
    }

    if (pages === undefined) return;

    /** Диалог сохранения файла */
    let savePath = File.saveDialog('Save path','*.miro');
    if (savePath === null) return;

    /** Пишем все картинки */
    if (env === 'IDSN'){
        exportImagesFromInDesign(pages,path,scale);
    } else if (env === 'ILST'){
        exportImagesFromIllustrator(pages,path,scale);
    }

    exportJSON(pages,path);

    return JSON.stringify({ path: decodeURI(savePath.relativeURI), pages: pages });

}

/**+++++++++++++++++++++++++++++++++++++++++++++++++**/
/**+++++++++++++++++++++++++++++++++++++++++++++++++**/

function getPagesObjectFromIllustrator(scale) {

    const artboards = app.activeDocument.artboards;

    let artboardsNames = getArtboardsNames(artboards);

    if (artboards.length > artboardsNames.length) {
        alert('Artboard names must be unique! They will be used to update artboards on miro board.');
        return;
    }

    function getArtboardsNames(artboards) {
        let obj = {};
        artboards.forEach((el,e)=>{obj[el.name]=e});
        return Object.keys(obj);
    }

    const arr = artboards.map((el)=>{

        let h = (el.artboardRect[1]-el.artboardRect[3]) * scale;
        let w = (el.artboardRect[2]-el.artboardRect[0]) * scale;

        return {
            title: el.name,
            externalId: el.name,
            filename: el.name.replace(' ','_').toLowerCase() + '.png',
            y: - ( h * 0.5 + el.artboardRect[3] * scale ),
            x: w * 0.5 + el.artboardRect[0] * scale,
            height: h,
            width: w,
            artboardRect: el.artboardRect
        };
    });

    return arr;

}


function exportImagesFromIllustrator(pages,path,scale){

    pages.forEach((page,p)=>{

        let exportOptions = new ImageCaptureOptions();
        exportOptions.antiAliasing = true;
        exportOptions.matte = true;
        exportOptions.resolution = 72 * scale;
        exportOptions.transparency = false;

        let fileSpec = new File(path + page.filename);

        app.activeDocument.imageCapture(fileSpec, page.artboardRect, exportOptions);

    })

}

/**+++++++++++++++++++++++++++++++++++++++++++++++++**/
/**+++++++++++++++++++++++++++++++++++++++++++++++++**/

function exportJSON(json,saveStr) {

    let file = new File(saveStr + 'images.json');

    file.encoding = "utf-8";
    file.open("w");

    let jsonFileStr = JSON.stringify(json);
    //jsonFileStr = jsonFileStr.replace(/"(\d{15,})"(?!:)/g,'$1');

    file.write(jsonFileStr);
    file.close();

    return null;

}