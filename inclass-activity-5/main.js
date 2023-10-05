const subjects = [
  {
    name: "Maths",
    credits: 1,
  },
  {
    name: "Geography",
    credits: 1,
  },
  {
    name: "Biology",
    credits: 1,
  },
  {
    name: "English",
    credits: 1,
  },
  { name: "Chemistry", credits: 1 },
];
const students = [
  {
    name: "Mark",
    gender: "M",
  },
  {
    name: "Leo",
    gender: "M",
  },
  {
    name: "Eve",
    gender: "F",
  },
  {
    name: "Annie",
    gender: "F",
  },
  {
    name: "Nick",
    gender: "M",
  },
  {
    name: "Bob",
    gender: "M",
  },
  {
    name: "Alice",
    gender: "F",
  },
];

const reports = [
  [72, 94, 74, 78, 70],
  [78, 87, 79, 72, 82],
  [83, 76, 62, 85, 68],
  [88, 79, 68, 90, 73],
  [75, 80, 71, 63, 94],
  [56, 78, 67, 84, 79],
  [91, 84, 85, 77, 72],
];

const grades = [
  {
    grade: "A+",
    minPercent: 90,
    maxPercent: 100,
    minNumerical: 4.0,
    maxNumerical: 4.0,
    gpa: 4.0,
  },
  {
    grade: "A",
    minPercent: 85,
    maxPercent: 89,
    minNumerical: 3.7,
    maxNumerical: 3.99,
    gpa: 3.7,
  },
  {
    grade: "A-",
    minPercent: 80,
    maxPercent: 84,
    minNumerical: 3.3,
    maxNumerical: 3.69,
    gpa: 3.3,
  },
  {
    grade: "B+",
    minPercent: 75,
    maxPercent: 79,
    minNumerical: 3.0,
    maxNumerical: 3.29,
    gpa: 3.0,
  },
  {
    grade: "B",
    minPercent: 70,
    maxPercent: 74,
    minNumerical: 2.7,
    maxNumerical: 2.99,
    gpa: 2.7,
  },
  {
    grade: "B-",
    minPercent: 65,
    maxPercent: 69,
    minNumerical: 2.3,
    maxNumerical: 2.69,
    gpa: 2.3,
  },
  {
    grade: "C+",
    minPercent: 60,
    maxPercent: 64,
    minNumerical: 2.0,
    maxNumerical: 2.29,
    gpa: 2.0,
  },
  {
    grade: "C",
    minPercent: 55,
    maxPercent: 59,
    minNumerical: 1.7,
    maxNumerical: 1.99,
    gpa: 1.7,
  },
  {
    grade: "C-",
    minPercent: 50,
    maxPercent: 54,
    minNumerical: 1.3,
    maxNumerical: 1.69,
    gpa: 1.3,
  },
  {
    grade: "D",
    minPercent: 0,
    maxPercent: 49,
    minNumerical: 1.0,
    maxNumerical: 1.29,
    gpa: 1.0,
  },
  {
    grade: "F",
    minPercent: 0,
    maxPercent: 49,
    minNumerical: 0.0,
    maxNumerical: 0.99,
    gpa: 0.0,
  },
];

const reportTable = document.getElementById("report-table");
const classAverageEl = document.getElementById("class-average");

const gpaAverageTable = document.getElementById("gpa-average-table");
const gpaSortOrderButton = document.getElementById("gpa-sort-order");
const gpaSortOrderButtonAsc = document.getElementById("gpa-sort-order-asc");
const gpaSortOrderButtonDesc = document.getElementById("gpa-sort-order-desc");

const subjectAverageTable = document.getElementById("subject-average-table");
const subjectSortOrderButton = document.getElementById("subject-sort-order");
const subjectSortOrderButtonAsc = document.getElementById(
  "subject-sort-order-asc"
);
const subjectSortOrderButtonDesc = document.getElementById(
  "subject-sort-order-desc"
);

const graphs = document.getElementById("graphs");

const drawGraph = (svgId, slices) => {
  const divEl = document.createElement("div");
  divEl.id = `graph-${svgId}`;
  divEl.classList.add("graph");
  divEl.innerHTML = `<svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)" id="${svgId}"></svg>`;

  graphs.appendChild(divEl);

  const svgEl = document.getElementById(svgId);
  // https://david-gilbertson.medium.com/a-simple-pie-chart-in-svg-dbdd653b6936
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  slices.forEach((slice) => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);

    // each slice starts where the last slice ended, so keep a cumulative percent
    cumulativePercent += slice.percent;

    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

    // if the slice is more than 50%, take the large arc (the long way around)
    const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

    // create an array and join it just for code readability
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      `L 0 0`, // Line
    ].join(" ");

    // create a <path> and append it to the <svg> element
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathEl.classList.add("slice");
    pathEl.setAttribute("d", pathData);
    pathEl.setAttribute("fill", slice.color);
    pathEl.setAttribute("title", slice.title);
    svgEl.appendChild(pathEl);
  });
};

const getGradeFromCredits = (credit) => {
  const grade = grades.find(({ grade, maxNumerical, minNumerical }) => {
    return credit >= minNumerical && credit <= maxNumerical;
  });
  return grade;
};
const getGradeFromScore = (score) => {
  const grade = grades.find(({ grade, maxPercent, minPercent }) => {
    return score >= minPercent && score <= maxPercent;
  });
  return grade;
};

const computedStudentResult = students.map(({ name, gender }, index) => {
  const scores = reports?.[index] || [];

  let highest = {};
  let lowest = {};
  const scoresWithSubject = subjects
    .map((subject, i) => {
      const score = scores?.[i] || "N/A";

      return {
        subject,
        score,
      };
    })
    .reduce((acc, { subject, score }) => {
      acc[subject.name] = {
        score,
        grade: getGradeFromScore(score),
        credits: subject.credits,
      };

      if (!highest?.score || score > highest?.score) {
        highest = { subject, ...acc[subject.name] };
      }
      if (!lowest?.score || score < lowest?.score) {
        lowest = { subject, ...acc[subject.name] };
      }
      return acc;
    }, {});

  const gpa = parseFloat(
    (
      Object.values(scoresWithSubject).reduce((acc, { grade, credits }) => {
        acc += grade.gpa * credits;
        return acc;
      }, 0) /
      subjects.reduce((acc, curr) => {
        acc += curr.credits;
        return acc;
      }, 0)
    ).toFixed(2)
  );

  return {
    name,
    gender,
    scoresWithSubject,
    gpa: {
      point: gpa,
      grade: getGradeFromCredits(gpa).grade,
    },
    highest,
    lowest,
  };
});

const computedSubjectResult = subjects.map((subject) => {
  let highest = {};
  let lowest = {};
  const scores = computedStudentResult.reduce((acc, curr, i) => {
    const { grade, score } = curr.scoresWithSubject[subject.name];
    acc.push({
      score: grade.gpa,
      gender: curr.gender,
    });
    if (!highest?.score || score > highest?.score) {
      highest = { score, studentName: curr.name, grade };
    }
    if (!lowest?.score || score < lowest?.score) {
      lowest = { score, studentName: curr.name, grade };
    }
    return acc;
  }, []);

  const total = parseFloat(
    scores
      .reduce((acc, curr) => {
        acc += curr.score;
        return acc;
      }, 0)
      .toFixed(2)
  );

  const byGenders = scores.reduce(
    (acc, curr) => {
      acc[curr.gender].score += curr.score;
      acc[curr.gender].count++;
      return acc;
    },
    {
      M: {
        score: 0,
        count: 0,
      },
      F: {
        count: 0,
        score: 0,
      },
    }
  );

  Object.keys(byGenders).forEach((key) => {
    byGenders[key].score = parseFloat(byGenders[key].score.toFixed(2));

    const { score, count } = byGenders[key];

    byGenders[key].average = parseFloat((score / count).toFixed(2));
  });

  return {
    highest,
    lowest,
    scores,
    total,
    average: parseFloat((total / computedStudentResult.length).toFixed(2)),
    byGenders,
    ...subject,
  };
});

const totalClassPoints = parseFloat(
  computedSubjectResult
    .reduce((acc, { average }) => {
      acc += average;
      return acc;
    }, 0)
    .toFixed(2)
);

const averageClassPoints = parseFloat(
  (totalClassPoints / computedSubjectResult.length).toFixed(2)
);

const sort = (incomingData, sortFunc) => {
  //   const data = JSON.parse(JSON.stringify(incomingData));
  const data = incomingData;
  data.sort(sortFunc);
  return data;
};

const sortStudentByGpa = () => {
  return sort(computedStudentResult, (a, b) => {
    const gpaForA = a.gpa.point;
    const gpaForB = b.gpa.point;

    if (gpaForA > gpaForB) {
      return 1;
    } else if (gpaForA < gpaForB) {
      return -1;
    }
    return 0;
  });
};
const sortSubjectByAvg = () => {
  return sort(computedSubjectResult, (a, b) => {
    const averageForA = a.average;
    const averageForB = b.average;

    if (averageForA > averageForB) {
      return 1;
    } else if (averageForA < averageForB) {
      return -1;
    }
    return 0;
  });
};

let gpaSortOrder = "DESC";
gpaSortOrderButton.innerText = gpaSortOrder;
gpaSortOrderButton.onclick = () => {
  if (gpaSortOrder === "ASC") {
    gpaSortOrder = "DESC";
  } else {
    gpaSortOrder = "ASC";
  }
  gpaSortOrderButton.innerText = gpaSortOrder;
  renderGpaSort();
};

gpaSortOrderButtonAsc.onclick = () => {
  gpaSortOrder = "ASC";
  gpaSortOrderButton.innerText = gpaSortOrder;

  renderGpaSort();
};

gpaSortOrderButtonDesc.onclick = () => {
  gpaSortOrder = "DESC";
  gpaSortOrderButton.innerText = gpaSortOrder;

  renderGpaSort();
};
const renderGpaSort = () => {
  const gpaHtml = [];

  let headerHtml = "";
  headerHtml += "<th>Name</th>";
  headerHtml += "<th>Average</th>";
  headerHtml += "<th>Highest</th>";
  headerHtml += "<th>Lowest</th>";
  headerHtml += "<th>Compared to Class Average</th>";

  gpaHtml.push(`<tr>${headerHtml}</tr>`);

  const sortedByGpa = sortStudentByGpa();

  if (gpaSortOrder !== "ASC") {
    sortedByGpa.reverse();
  }

  for (let i = 0; i < sortedByGpa.length; i++) {
    const { name, gpa, highest, lowest } = sortedByGpa[i];
    let htmlReport = "";

    htmlReport += `<td class="name">${name}</td>`;
    htmlReport += `<td class="average">${gpa.grade} => ${gpa.point}</td>`;
    htmlReport += `<td class="highest">Received in <span class="bold">${highest.subject.name}</span> (${highest.score}, ${highest.grade.gpa})</td>`;
    htmlReport += `<td class="lowest">Received in <span class="bold">${lowest.subject.name}</span> (${lowest.score}, ${lowest.grade.gpa})</td>`;
    htmlReport += `<td class="comparison-with-class-average">${
      gpa.point > averageClassPoints ? "⬆️" : "⬇️"
    }</td>`;

    gpaHtml.push(`<tr>${htmlReport}</tr>`);
  }

  gpaAverageTable.innerHTML = gpaHtml.join("");
};

let subjectSortOrder = "DESC";
subjectSortOrderButton.innerText = subjectSortOrder;
subjectSortOrderButton.onclick = () => {
  if (subjectSortOrder === "ASC") {
    subjectSortOrder = "DESC";
  } else {
    subjectSortOrder = "ASC";
  }
  subjectSortOrderButton.innerText = subjectSortOrder;
  renderSubjectSort();
};
subjectSortOrderButtonAsc.onclick = () => {
  subjectSortOrder = "ASC";
  subjectSortOrderButton.innerText = subjectSortOrder;

  renderSubjectSort();
};
subjectSortOrderButtonDesc.onclick = () => {
  subjectSortOrder = "DESC";
  subjectSortOrderButton.innerText = subjectSortOrder;

  renderSubjectSort();
};
const renderSubjectSort = () => {
  const subjectsHtml = [];

  let headerHtml = "";
  headerHtml += "<th>Name</th>";
  headerHtml += "<th>Average</th>";
  headerHtml += "<th>Highest</th>";
  headerHtml += "<th>Lowest</th>";
  headerHtml += "<th>Compared to Class Average</th>";

  subjectsHtml.push(`<tr>${headerHtml}</tr>`);

  const sortedSubjects = sortSubjectByAvg();

  if (subjectSortOrder !== "ASC") {
    sortedSubjects.reverse();
  }

  for (let i = 0; i < sortedSubjects.length; i++) {
    const { average, name, highest, lowest } = sortedSubjects[i];
    let htmlReport = "";

    htmlReport += `<td class="name">${name}</td>`;
    htmlReport += `<td class="average">${average}</td>`;
    htmlReport += `<td class="highest">Received by <span class="bold">${highest.studentName}</span> (${highest.score}, ${highest.grade.gpa})</td>`;
    htmlReport += `<td class="lowest">Received by <span class="bold">${lowest.studentName}</span> (${lowest.score}, ${lowest.grade.gpa})</td>`;
    htmlReport += `<td class="comparison-with-class-average">${
      average > averageClassPoints ? "⬆️" : "⬇️"
    }</td>`;

    subjectsHtml.push(`<tr>${htmlReport}</tr>`);
  }

  subjectAverageTable.innerHTML = subjectsHtml.join("");
};

const init = () => {
  const reportsHtml = [];

  let headerHtml = "";
  headerHtml += "<th class='borderless'></th>";
  headerHtml += "<th class='borderless'></th>";

  subjects.forEach((subject) => (headerHtml += `<th>${subject.name}</th>`));
  headerHtml += "<th>GPA</th>";

  reportsHtml.push(`<tr>${headerHtml}</tr>`);

  for (let i = 0; i < students.length; i++) {
    const { name, gender } = students[i];
    const scores = reports?.[i] || [];

    let htmlReport = "";

    htmlReport += `<td class="gender">${gender}</td>`;
    htmlReport += `<th class="name">${name}</th>`;

    subjects.forEach((subject, j) => {
      const score = scores?.[j] || "-";
      htmlReport += `<td class="score">${score}</td>`;
    });

    htmlReport += `<td class="gpa">${computedStudentResult[i].gpa.grade} => ${computedStudentResult[i].gpa.point}</td>`;

    reportsHtml.push(`<tr>${htmlReport}</tr>`);
  }

  reportTable.innerHTML = reportsHtml.join("");

  const subjectSlices = computedSubjectResult.map(({ byGenders, name }) => {
    const male = byGenders.M;
    const female = byGenders.F;

    const total = male.average + female.average;
    const malePercent = male.average / total;
    const femalePercent = female.average / total;
    return {
      subject: name,
      highest:
        malePercent === femalePercent
          ? "Both"
          : malePercent > femalePercent
          ? "Male"
          : "Female",
      malePercent,
      femalePercent,
      slices: [
        {
          percent: malePercent,
          color: "cornflowerblue",
        },
        {
          percent: femalePercent,
          color: "pink",
        },
      ],
    };
  });

  subjectSlices.forEach(
    ({ slices, subject, highest, malePercent, femalePercent }) => {
      drawGraph(subject, slices);
      const subjectEl = document.getElementById(`graph-${subject}`);
      subjectEl.innerHTML += `<div>
			<p class="bold">${subject}</p>
			<p>Male percent is ${(malePercent * 100).toFixed(2)}%</p>
			<p>Female percent is ${(femalePercent * 100).toFixed(2)}%</p>
			<p>Highest is ${highest}</p>
			</div>
		`;
    }
  );

  console.log(computedStudentResult);
  console.log(computedSubjectResult);

  renderGpaSort();
  renderSubjectSort();

  classAverageEl.innerText = `Class Average is ${averageClassPoints}`;
};

init();
