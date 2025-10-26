export function computeAverages({ slipTests, assignments, classTests, attendanceMarks }) {
  const slipBest2 = slipTests
    .sort((a, b) => b - a)
    .slice(0, 2);
  const slipTestAverage = slipBest2.reduce((a, b) => a + b, 0) / 2;

  const assignmentAverage =
    assignments.slice(0, 2).reduce((a, b) => a + b, 0) / 2;

  const classTestAverage = classTests.slice(0, 2).reduce((a, b) => a + b, 0) / 2;

  const totalMarks =
    slipTestAverage + assignmentAverage + classTestAverage + attendanceMarks;

  return { slipTestAverage, assignmentAverage, classTestAverage, totalMarks };
}
