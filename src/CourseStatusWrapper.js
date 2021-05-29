import { Route, Switch } from "react-router-dom";

import IntroPage1 from "./pages/IntroPage1";
import IntroPage2 from "./pages/IntroPage2";

import getFromLocalStorage from "./functions/getFromLocalStorage";
import { useState } from "react";
import Home from "./Home";

const CourseStatusWrapper = ({ graphElements, groupedBySemCourses }) => {
  const name = getFromLocalStorage("name", "");
  const taken = getFromLocalStorage("taken", null);
  const taking = getFromLocalStorage("taking", null);
  const [hasIntroData, setHasIntroData] = useState(name !== "" && taken !== null && taking !== null);
  console.log("COURSESTATUSWRAPPER rendered");
  return (
    <Switch>
      <Route path="/intro1">
        <IntroPage1 />
      </Route>
      <Route path="/intro2">
        <IntroPage2
          hasIntroData={hasIntroData}
          setHasIntroData={setHasIntroData}
          graphElements={graphElements}
          groupedBySemCourses={groupedBySemCourses}
        />
      </Route>

      <Route path="/">
        <Home hasIntroData={hasIntroData} graphElements={graphElements} groupedBySemCourses={groupedBySemCourses} />
      </Route>
    </Switch>
  );
};

export default CourseStatusWrapper;