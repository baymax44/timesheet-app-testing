import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsWithDate,
  selectUserData,
  selectViewType,
  setViewType,
  setCurStartEndDate
} from "../redux/appReducer";
import {
  formatDate,
  getBeforeMonthFromTo,
  getBeforeWeekFromTo,
  getMonthStartEnd,
  getNextMonthFromTo,
  getNextWeekFromTo,
  getWeekStartEnd,
} from "../util";

let currentWeek = getWeekStartEnd(new Date());
let currentMonth = getMonthStartEnd(new Date());

const SelectButton = () => {
  const dispatch = useDispatch();
  const viewType = useSelector(selectViewType);
  const userData = useSelector(selectUserData);
  const [curDateRange, setCurDataRange] = useState()


  const clickTimeButton = (buttonType) => {
    dispatch(setViewType({ data: buttonType }));

    var startdate = '', enddate = '';
    if (buttonType == "Weekly") { 
      // console.log(`Start: ${currentWeek.startOfWeek.toDateString()} End: ${currentWeek.endOfWeek.toDateString()}`);
      setCurDataRange(`${currentWeek.startOfWeek.toDateString()} - ${currentWeek.endOfWeek.toDateString()}`)
      startdate = formatDate(currentWeek.startOfWeek.toDateString())
      enddate = formatDate(currentWeek.endOfWeek.toDateString())
    } else {
      // monthly
      // console.log(`Start: ${currentMonth.startOfMonth.toDateString()} End: ${currentMonth.endOfMonth.toDateString()}`);
      setCurDataRange(`${currentMonth.startOfMonth.toDateString()} - ${currentMonth.endOfMonth.toDateString()}`)
      startdate = formatDate(currentMonth.startOfMonth.toDateString())
      enddate = formatDate(currentMonth.endOfMonth.toDateString())
    }
    dispatch(setCurStartEndDate({startdate, enddate}));

    // call the function of the parent in dashboard
    dispatch(
      getProductsWithDate({
        userId: userData._id,
        fromDate: startdate,
        toDate: enddate,
      })
    );
  };

//   const backButton = document.querySelector("#back");
// const nextButton = document.querySelector("#next");
// const display = document.querySelector("#display");
  useEffect(() => {
    if(viewType && (currentWeek || currentMonth)) {
      if(viewType == 'Weekly') {
        setCurDataRange(`${currentWeek.startOfWeek.toDateString()} - ${currentWeek.endOfWeek.toDateString()}`)
      } else {
        setCurDataRange(`${currentMonth.startOfMonth.toDateString()} - ${currentMonth.endOfMonth.toDateString()}`)
      }
    }
  }, [viewType])

  // display.innerHTML = `Start: ${currentMonth.startOfMonth.toDateString()} End: ${currentMonth.endOfMonth.toDateString()}`;
  // console.log("reduxCurWeekMonth=========", reduxCurWeekMonth)
  // if(!reduxCurWeekMonth) {
  //   currentWeek = getWeekStartEnd(new Date().toISOString());
  //   currentMonth = getMonthStartEnd(new Date().toISOString());
  //   // dispatch(setCurWeekMonth({currentWeek, currentMonth}));
  // } else {
  //   currentWeek = reduxCurWeekMonth.currentWeek;
  //   currentMonth = reduxCurWeekMonth.currentWeek;
  // }



  const clickBeforeNextButton = (buttonType) => {
    var startdate = '', enddate = '';
    if (buttonType == 'Next') {
      if (viewType == "Weekly") { 
        currentWeek = getWeekStartEnd(new Date(currentWeek.startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000));
        // console.log(`Start: ${currentWeek.startOfWeek.toDateString()} End: ${currentWeek.endOfWeek.toDateString()}`);
        setCurDataRange(`${currentWeek.startOfWeek.toDateString()} - ${currentWeek.endOfWeek.toDateString()}`)
        startdate = formatDate(currentWeek.startOfWeek.toDateString())
        enddate = formatDate(currentWeek.endOfWeek.toDateString())
      } else {
        // monthly
        currentMonth = getMonthStartEnd(new Date(currentMonth.startOfMonth.getFullYear(), currentMonth.startOfMonth.getMonth() + 1, 1));
        // console.log(`Start: ${currentMonth.startOfMonth.toDateString()} End: ${currentMonth.endOfMonth.toDateString()}`);
        setCurDataRange(`${currentMonth.startOfMonth.toDateString()} - ${currentMonth.endOfMonth.toDateString()}`)
        startdate = formatDate(currentMonth.startOfMonth.toDateString())
        enddate = formatDate(currentMonth.endOfMonth.toDateString())
      }
    } else {
      // before
      if (viewType == "Weekly") {
        currentWeek = getWeekStartEnd(new Date(currentWeek.startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
        console.log(`Start: ${currentWeek.startOfWeek.toDateString()} End: ${currentWeek.endOfWeek.toDateString()}`);
        setCurDataRange(`${currentWeek.startOfWeek.toDateString()} - ${currentWeek.endOfWeek.toDateString()}`)
        startdate = formatDate(currentWeek.startOfWeek.toDateString())
        enddate = formatDate(currentWeek.endOfWeek.toDateString())
      } else {
        // monthly
        currentMonth = getMonthStartEnd(new Date(currentMonth.startOfMonth.getFullYear(), currentMonth.startOfMonth.getMonth() - 1, 1));
        console.log(`Start: ${currentMonth.startOfMonth.toDateString()} End: ${currentMonth.endOfMonth.toDateString()}`);
        setCurDataRange(`${currentMonth.startOfMonth.toDateString()} - ${currentMonth.endOfMonth.toDateString()}`)
        startdate = formatDate(currentMonth.startOfMonth.toDateString())
        enddate = formatDate(currentMonth.endOfMonth.toDateString())
      }
    }

    dispatch(setCurStartEndDate({startdate, enddate}));

    // call the function of the parent in dashboard


    dispatch(
      getProductsWithDate({
        userId: userData._id,
        fromDate: startdate,
        toDate: enddate,
      })
    );
  };
  return (
    <div
      className="flex rounded-md justify-between shadow-sm w-[100%] py-4 px-4"
      role="group"
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => clickBeforeNextButton("Before")}
          className={`px-4 py-2 text-sm font-medium border rounded-l-lg border-gray-600 text-white`}
        >
          Before
        </button>
        <button
          type="button"
          onClick={() => clickBeforeNextButton("Next")}
          className={`px-4 py-2 text-sm border-gray-600 font-medium border rounded-r-md text-white`}
        >
          Next
        </button>

        <h3 className="curdate-range text-white text-bold ml-5">{curDateRange}</h3>

      </div>
      <div className="">
        <button
          type="button"
          disabled={viewType == "Weekly"}
          onClick={() => clickTimeButton("Weekly")}
          className={`${
            viewType == "Weekly"
              ? "bg-white text-gray-600"
              : "bg-gray-700 text-white"
          } px-4 py-2 text-sm font-medium border  rounded-l-lg
          border-gray-600`}
        >
          Weekly
        </button>
        <button
          type="button"
          disabled={viewType == "Monthly"}
          onClick={() => clickTimeButton("Monthly")}
          className={`${
            viewType == "Monthly"
              ? "bg-white text-gray-600"
              : "bg-gray-700 text-white"
          } px-4 py-2 text-sm border-gray-600 font-medium border rounded-r-md`}
        >
          Monthly
        </button>
      </div>
    </div>
  );
};

export default SelectButton;
