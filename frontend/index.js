var obj_csv = {
    size:0,
    dataFile:[]
};
 
function readImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
        reader.onload = function (e) {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            csvData = parseData(obj_csv.dataFile)
            csvData.shift()
            csvData.pop()
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

function getMaxSlopesAndIds(){ //numberOfIds
    var slopes = {} //create dictionary to hold slopes with ids as key
    var maxIds = [] //create list to house the id's with highest slopes (greatest increase in demand)
    var lrModels = []
    for(let i = 0; i < csvData.length; i++) {
        let lrVals = [[1, parseInt(csvData[i][5])], [2, parseInt(csvData[i][6])], [3, parseInt(csvData[i][7])], [4, parseInt(csvData[i][8])], [5, parseInt(csvData[i][9])], [6, parseInt(csvData[i][10])]] //store pair Values in an Array
        lrModels[i] = regression.linear(lrVals);
        
        console.log(lrVals)
        console.log(lrModels[i].equation[0])
        //slopes[csvData[i][0]] = lr.equation[0]
    }

}

// const gradient = result.equation[0];
// const yIntercept = result.equation[1];

//Calculate slope for every row (Month as x, new value as y)
//get max slope (or top 20-30 or something), these are doctors trending higher
//show individual data points month to month
//use r2 to check reliability of fit (low r2 may show outliers, data not as it seems)