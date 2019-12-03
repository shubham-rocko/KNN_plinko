const outputs = [];
const distancePoint = 300;
const k=10;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const k= 10;

  _.range(0,3).forEach((feature) => {
    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataSet(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter((testPoint) => KNN(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

    console.log("for feature of", feature, "accuracy is", accuracy);
  });
}

function KNN(data, testPoint, k){
  const bucket = _.chain(data)
  .map(rows => {
    return [
      calcDistance(_.initial(rows), testPoint), 
      _.last(rows)
    ];
  })
  .sortBy(rows => rows[0])
  .slice(0,k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();

  return bucket;
}

function calcDistance(pointA, pointB){
  const distance = _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .value() ** 0.5;
    return distance;
  // return Math.abs(pointA - pointB);
}

function splitDataSet(data, testCount){
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

function minMax(data, featureCount){
  const clonedData = _.cloneDeep(data);

  for(let i=0; i<featureCount; i++){
    const column = clonedData.map(row => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for(let j=0; j<clonedData.length; j++){
      clonedData[j][i] = (clonedData[j][i]-min)/(max-min);
    }
  }

  return clonedData;
}
