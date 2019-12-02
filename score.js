const outputs = [];
const distancePoint = 300;
const k=10;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataSet(outputs, testSetSize);

  _.range(1,15).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter((testPoint) => KNN(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

    console.log("Accuracy:", accuracy);
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
