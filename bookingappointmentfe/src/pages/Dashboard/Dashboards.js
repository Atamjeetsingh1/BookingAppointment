import moment from "moment";
import React, { useState ,useEffect} from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Modal,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

import { Create, Edit, getSchedulesById,getSchedules } from "../../api/Function"

import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";

const Dashboards = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duration, setDuration] = useState(60);
  const [slots, setSlots] = useState([{ start: "09:00", end: "10:00" }]);
  const [scheduleType, setScheduleType] = useState("weekly");
  const [dateRange, setDateRange] = useState([null, null]);
  const [availability, setAvailability] = useState([]);
  const times = Array.from({ length: 48 }, (_, index) =>
    moment().startOf("day").add(30 * index, "minutes").format("HH:mm")
  )

  const fetchDefaultSlots = async () => {
    try {
      const { startDate, endDate } = getStartAndEndDate(scheduleType,selectedDate,dateRange);  
      if (!startDate || !endDate) {
        throw new Error("Invalid date range.");
      }
     const response = await getSchedules(startDate,endDate);
     console.log(response.data,"dataresponse")
      return response.data;
    } catch (error) {
      console.error("Error fetching default slots:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const slotsdefault = await fetchDefaultSlots();
      setAvailability(slotsdefault.data); 
      console.log("Data fetched:",slotsdefault.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDateClick = async (date) => {
    try {
      console.log(date,"date")
      setSelectedDate(date);
      const formattedDate = moment(date).startOf("day").toISOString();
      const schedule = availability.find(
        (item) => moment(item.date).startOf("day").toISOString() === formattedDate
      );
      if (schedule) {
        console.log("Schedule ID:", schedule._id);
        const response = await getSchedulesById(schedule._id); 
console.log(response.data.data,"responseerhjtkehgtirehrehrieo")
        if (response.status === 200 || response.status === 201) {
          const data = response.data.data;
          //slots updated based on this data
          setSlots(
            data.time_slots.map((slot) => ({ 
              start: moment(slot.start_time).format("HH:mm"),
              end: moment(slot.end_time).format("HH:mm"),
            }))
          );
          console.log("Fetched Data:", data);
        } else {
          alert("Failed to fetch data for the selected date.");
        }
      } else {
        // If no schedule exists, reset to default slots
        //setSlots([{ start: "09:00", end: "10:00" }]);
        setSlots([{ start: "09:00", end: moment("09:00", "HH:mm").add(parseInt(duration, 10), "minutes").format("HH:mm") }]);
      }
    } catch (error) {
      console.error("Error fetching data for the selected date:", error);
      alert("An error occurred while fetching data for the selected date.");
    }
    setIsModalOpen(true);
  };
  const handleAddSlot = () => {
    setSlots([...slots, { start: "09:00", end: "10:00" }]);
  };
  const handleRemoveSlot = (index) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    if (updatedSlots.length >= 1) {
      setSlots(updatedSlots);
    }
  };
  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    if (field === "start") {
      updatedSlots[index].end = moment(value, "HH:mm")
        .add(duration, "minutes")
        .format("HH:mm");
    }
    setSlots(updatedSlots);
  };

  const getStartAndEndDate = (scheduleType, selectedDate, customRange) => {
    const baseDate = new Date(selectedDate); 
  
    if (scheduleType === "weekly") {
      const startDate = new Date(baseDate);
       startDate.setHours(0, 0, 0, 0);
  
      const endDate = new Date();
      endDate.setDate(baseDate.getDate() + (6 - baseDate.getDay()));     endDate.setHours(23, 59, 59, 999);
  
      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    }
  
    if (scheduleType === "monthly") {
      const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);    startDate.setHours(0, 0, 0, 0);
  
      const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);     endDate.setHours(23, 59, 59, 999);
  
      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    }
  
    if (scheduleType === "custom" && customRange) {
      const { startDate, endDate } = customRange;
      return {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };
    }
  
    return null; 
  };
  // const getDisabledTimes = () => {
  //   const disabledTimes = new Set();
  //   const now = moment().format("HH:mm");
  //   times.forEach((time) => {
  //     if (time < now) {
  //       disabledTimes.add(time);
  //     }
  //   });

  //   slots.forEach((slot) => {
  //     const slotStart = moment(slot.start, "HH:mm");
  //     const slotEnd = moment(slot.end, "HH:mm");

  //     times.forEach((time) => {
  //       const currentTime = moment(time, "HH:mm");
  //       if (
  //         currentTime.isBetween(slotStart, slotEnd, "minutes", "[)") || // Overlaps start or within
  //         currentTime.clone().add(duration, "minutes").isBetween(slotStart, slotEnd, "minutes", "[)") // Overlaps end after adding duration
  //       ) {
  //         disabledTimes.add(time);
  //       }
  //     });
  //   });

  //   return disabledTimes;
  // };
  const handleSaveDefault = async () => {
    try {
      let startDate = moment(selectedDate).startOf("day");
      let endDate = startDate.clone();

      if (scheduleType === "weekly") {
        endDate = moment().endOf("week");
      } else if (scheduleType === "monthly") {
        endDate = moment().endOf("month");
      } else if (scheduleType === "custom") {
        if (dateRange[0] && dateRange[1]) {
          startDate = moment(dateRange[0]).startOf("day");
          endDate = moment(dateRange[1]).endOf("day");
        } else {
          alert("Please select a valid custom date range.");
          return;
        }
      }

      const dates = [];
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.clone().toISOString());
        currentDate.add(1, "day");
      }

      const payload = dates.map((date) => ({
        date: moment(date).utc().toISOString(),
        time_slots: slots.map((slot) => ({
          start_time: moment(date)
            .set({
              hour: moment(slot.start, "HH:mm").hours(),
              minute: moment(slot.start, "HH:mm").minutes(),
            })
            .utc()
            .toISOString(),
          end_time: moment(date)
            .set({
              hour: moment(slot.end, "HH:mm").hours(),
              minute: moment(slot.end, "HH:mm").minutes(),
            })
            .utc()
            .toISOString(),
        })),
        duration,
      }));
      const response = await Create(payload)
      console.log("Default Payload:", JSON.stringify(payload, null, 2));
      if (response.status === 200 || response.status === 201) {
        console.log("response ", response.data.data)
        fetchData(); 
        alert("Default slots saved successfully!");
        //fetchDefaultData(); // Refresh the data
      } else {
        alert("Failed to save default slots.");
      }
    }
    catch (error) {
      console.error("Error saving default slots:", error);
      alert("An error occurred while saving default slots.");
    }
    setIsModalOpen(false);
    setScheduleType("")
  };
  const handleSaveForDate = async () => {
    try {
      // Find the schedule_id for the selected date
      const scheduleEntry = availability.find(
        (entry) =>
          moment(entry.date).startOf("day").toISOString() ===
          moment(selectedDate).startOf("day").toISOString()
      );

      if (!scheduleEntry) {
        alert("No schedule_id found for the selected date.");
        return;
      }

      const payload = [
        {
          schedule_id: scheduleEntry._id,
          time_slots: slots.map((slot) => ({
            start_time: moment(selectedDate)
              .set({
                hour: moment(slot.start, "HH:mm").hours(),
                minute: moment(slot.start, "HH:mm").minutes(),
              })
              .utc()
              .toISOString(),
            end_time: moment(selectedDate)
              .set({
                hour: moment(slot.end, "HH:mm").hours(),
                minute: moment(slot.end, "HH:mm").minutes(),
              })
              .utc()
              .toISOString(),
          })),
          duration,
        },
      ];

      console.log("Updated Payload:", JSON.stringify(payload, null, 2));

      const response = await Edit(payload);

      if (response.status === 200 || response.status === 201) {
        alert("Slots for the selected date updated successfully!");
      } else {
        alert("Failed to update slots for the selected date.");
      }
    } catch (error) {
      console.error("Error updating slots for the selected date:", error);
      alert("An error occurred while updating slots for the selected date.");
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchData(); 
 }, []);
  // const handleSaveForDate = async () => {
  //   try {
  //     // Find the schedule_id for the selected date in the availability array
  //     const scheduleEntry = availability.find(
  //       (entry) =>
  //         moment(entry.date).startOf("day").toISOString() ===
  //         moment(selectedDate).startOf("day").toISOString()
  //     );
  //     if (!scheduleEntry) {
  //       alert("No schedule_id found for the selected date.");
  //       return;
  //     }
  //     console.log(scheduleEntry._id, "id")
  //     const payload = [{
  //       //schedule_id: scheduleEntry.schedule_id,
  //       schedule_id: scheduleEntry._id,
  //       time_slots: slots.map((slot) => ({
  //         start_time: moment(selectedDate)
  //           .set({
  //             hour: moment(slot.start, "HH:mm").hours(),
  //             minute: moment(slot.start, "HH:mm").minutes(),
  //           })
  //           .utc()
  //           .toISOString(),
  //         end_time: moment(selectedDate)
  //           .set({
  //             hour: moment(slot.end, "HH:mm").hours(),
  //             minute: moment(slot.end, "HH:mm").minutes(),
  //           })
  //           .utc()
  //           .toISOString(),
  //       })),
  //       duration,
  //     }];
  //     console.log("Updated Payload:", JSON.stringify(payload, null, 2));
  //     const response = await Edit(payload);

  //     if (response.status === 200 || response.status === 201) {
  //       alert("Slots for the selected date updated successfully!");
  //     } else {
  //       alert("Failed to update slots for the selected date.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating slots for the selected date:", error);
  //     alert("An error occurred while updating slots for the selected date.");
  //   }
  //   setIsModalOpen(false);
  //   setScheduleType("")
  // };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Schedule
      </Typography>
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={selectedDate}
          disablePast
          onChange={handleDateClick}
          sx={{
            '.MuiPickersDay-root': {
              '&.Mui-selected': {
                backgroundColor: '#8E50FB',
                borderRadius: '0%', ':hover': {
                  color: '#fff',
                  backgroundColor: "#8E50FB"
                },
              },
            },
          }}
        />
      </LocalizationProvider> */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: "60px" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} >
          <DateCalendar
            value={selectedDate}
            disablePast
            onChange={handleDateClick}
            sx={{
              width: 300,
              '.MuiPickersCalendarHeader-root': {
                justifyContent: 'center',
                padding: '0px 0px',
              },
              '.MuiPickersCalendarHeader-labelContainer': {
                fontSize: '17px',
                fontWeight: 'bold',
              },
              '.MuiPickersDay-root': {
                width: '40px',
                height: '40px',
                margin: '0px',
                borderRadius: '0px',
                '&.Mui-selected': {
                  backgroundColor: '#8E50FB',
                  color: '#fff',
                  borderRadius: '0px',
                  '&:hover': {
                    backgroundColor: '#7A3FCC',
                  },
                },
                '&:hover': {
                  backgroundColor: 'grey',
                },
              },
              '.MuiPickersDay-outsideCurrentMonth': {
                opacity: 0.5,
              },
              '.MuiPickersDay-today': {
                border: '1px solid #8E50FB',
                backgroundColor: 'transparent',
              },
              '.MuiPickersSlideTransition-root': {
                minHeight: '280px',
              },
            }}
          />
        </LocalizationProvider></Box>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
          }}
        >
          {/* <Typography variant="h6" sx={{ mb: 2 }}>
          {moment(selectedDate).format("YYYY-MM-DD")}      
          </Typography> */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}> {/* Date Header */}
            <Typography
              variant="h7"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                mb: 3,
                fontSize: "18px",
              }}
            >
              {moment(selectedDate).format("DD-MM-YYYY")}
            </Typography>
          </Box>
          <Box>
            <Typography>  Duration (mins) </Typography>
          </Box>
          <TextField
            select
            value={duration}
            onChange={(e) => {
              setDuration(parseInt(e.target.value, 10))
             // setSlots([{ start: "09:00", end: "10:00" }]);
             setSlots([{ start: "09:00", end: moment("09:00", "HH:mm").add(parseInt(e.target.value, 10), "minutes").format("HH:mm") }]);
            }}
            
            sx={{ mb: 2 }}
          >
            {[30, 45, 60, 90, 120].map((value) => (
              <MenuItem key={value} value={value}>
                {value} mins
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              alignItems: "center",
              mb: 3,
              border: "1px solid #8E50FB",
              borderRadius: "8px",
              p: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, }}>
              {moment(selectedDate).format('dddd')}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Time Slots:
            </Typography>
            {slots.map((slot, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 1, pb: 1 }}>
                <TextField
                  select
                  value={slot.start}
                  onChange={(e) => handleSlotChange(index, "start", e.target.value)}
                >
                  {times.map((time) => (
                    <MenuItem key={time} value={time}
                    >
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="body1" sx={{ mt: "15px" }}>to</Typography>
                <TextField value={slot.end} disabled />
                <Box sx={{ display: "flex", mb: 1, pb: 1 }}>
                  <IconButton onClick={() => handleRemoveSlot(index)} color="error">
                    <RiDeleteBin5Line />
                  </IconButton>
                  {index === slots.length - 1 && (
                    <IconButton size="small" onClick={handleAddSlot}>
                      <AiOutlinePlusCircle size={24} color="#8E50FB" />
                    </IconButton>
                  )}</Box>
              </Box>
            ))}
          </Box>
          <RadioGroup
            value={scheduleType}
            onChange={(e) => {
              setScheduleType(e.target.value)
              setSlots([{ start: "09:00", end: moment("09:00", "HH:mm").add(parseInt(duration, 10), "minutes").format("HH:mm") }]);
            }}
            row
          >
            <FormControlLabel value="weekly" control={<Radio color="secondary" />} label="Weekly" />
            <FormControlLabel value="monthly" control={<Radio color="secondary" />} label="Monthly" />
            <FormControlLabel value="custom" control={<Radio color="secondary" />} label="Custom" />
          </RadioGroup>
          {/* {scheduleType === "custom" && (
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                type="date"
                value={dateRange[0]}
                onChange={(e) =>
                  setDateRange([e.target.value, dateRange[1]])
                }
              />
              <TextField
                type="date"
                value={dateRange[1]}
                onChange={(e) =>
                  setDateRange([dateRange[0], e.target.value])
                }
              />
            </Box>
          )} */}{scheduleType === "custom" && (
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={dateRange[0]}
                  disablePast
                  onChange={(date) => setDateRange([date, dateRange[1]])}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={dateRange[1]}
                  onChange={(date) => setDateRange([dateRange[0], date])}
                  disablePast
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          )}


          <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveDefault}
              sx={{
                bgcolor: "#8E50FB",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#7A3FCC",
                },
              }}
            >
              Set Default Values
            </Button>
            <Button
              variant="outlined"
              onClick={handleSaveForDate}
              sx={{
                borderColor: "#8E50FB",
                color: "#8E50FB",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#EDE7F6",
                },
              }}
            >
              Set for Selected Date
            </Button>
          </Box>

        </Box>
      </Modal>
    </Box>
  );
};
export default Dashboards;
{
  /*
  const weeklyRange = getStartAndEndDate("weekly", "2024-12-13");
console.log(weeklyRange);
// Output: { startDate: "2024-12-08T00:00:00.000Z", endDate: "2024-12-14T23:59:59.999Z" }

const monthlyRange = getStartAndEndDate("monthly", "2024-12-13");
console.log(monthlyRange);
// Output: { startDate: "2024-12-01T00:00:00.000Z", endDate: "2024-12-31T23:59:59.999Z" }

const customRange = getStartAndEndDate("custom", null, {
  startDate: "2024-12-10",
  endDate: "2024-12-20",
});
console.log(customRange);
// Output: { startDate: "2024-12-10T00:00:00.000Z", endDate: "2024-12-20T00:00:00.000Z" }
const getStartAndEndDate = (scheduleType, selectedDate, customRange) => {
  const baseDate = new Date(selectedDate); 

  if (scheduleType === "weekly") {
    // Start of the week
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - baseDate.getDay());
    startDate.setHours(0, 0, 0, 0);

    // End of the week
    const endDate = new Date(baseDate);
    endDate.setDate(baseDate.getDate() + (6 - baseDate.getDay()));
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  if (scheduleType === "monthly") {
    // Start of the month
    const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    // End of the month
    const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  if (scheduleType === "custom" && customRange) {
    const { startDate, endDate } = customRange;
    return {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };
  }

  // Default fallback for unsupported scheduleType
  return null; 
};

  */
}