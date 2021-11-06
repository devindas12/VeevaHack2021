var obj_csv = {
    size:0,
    dataFile:[]
};
 
function readImage(input) {
    //csvData = []
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
        reader.onload = function (e) {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            csvData = parseData(obj_csv.dataFile)
            csvData.shift()
        }
    }
}
 
function parseData(data){
    let csvData = [];
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });
    return csvData
}

function generateData(){
    console.log(csvData)
}