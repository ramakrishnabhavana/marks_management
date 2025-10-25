export function computeAverages({ slipTests, assignments, mids, attendanceMarks }) {
  const slipBest2 = slipTests
    .sort((a, b) => b - a)
    .slice(0, 2);
  const slipTestAverage = slipBest2.reduce((a, b) => a + b, 0) / 2;

  const assignmentAverage =
    assignments.reduce((a, b) => a + b, 0) / assignments.length;

  const midAverage = mids.reduce((a, b) => a + b, 0) / mids.length;

  const totalMarks =
    slipTestAverage + assignmentAverage + midAverage + attendanceMarks;

  return { slipTestAverage, assignmentAverage, midAverage, totalMarks };
}
