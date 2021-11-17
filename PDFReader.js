const fileInput = document.getElementById("pdf_input");
const pdfElement = document.getElementById("pdf");
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfJS/pdf.worker.js';

//bind change event to file input
fileInput.addEventListener("change", decodePDF);

function decodePDF(){
    const fileReader = new FileReader();
    fileReader.readAsDataURL(fileInput.files[0]);
    fileReader.onloadend = function (event){
        convertToBinary(event.target.result);
    };
}

const BASE64_MARKER = ';base64,';

function convertToBinary(dataURI){
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64); // what is an atob?
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for(let i=0; i < rawLength; i++){
        array[i] = raw.charCodeAt(i);
    }

    getPDF(array);
}

function getPageText(pageNum, PDFDocumentInstance){
    // Return a promise that is solved once the text of the page is retrieved return 'new Promise(function(resolve, reject){})'
    PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
        //The maiun trick to obtain the text og the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(function (textContent) {
            const textItems = textContent.items;
            let finalString = "";

            // Concatenate the string of the item to the final string 
            for(leti=0; i<textItems.lenght; i++) {
                const item = textItems[i];

                finalString += item.str + " ";
            }
            resolve(finalString);
        });
    });
}

function getPDF(pdfAsArray){
    pdfjsLib.getDocument(pdfAsArray).promise.then(function(pdf){
        for(let i=0; i <= pdf.lenght; i++){
            pdf.getPage(i).then(function (page){
                const scale = 1.5;
                const viewport = page.getViewport({scale: scale, });

                const canvas = document.getElementById("pdf");
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            })
        }
    }).catch(console.error);
}