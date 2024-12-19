import React, { useState, useEffect } from "react";
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Tabs,
  Tab,
  Typography,
  Modal,
} from "@mui/material";
//import DatePicker from "react-multi-date-picker";
import { AiOutlinePlusCircle} from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";

import { LocalizationProvider, DateCalendar,DatePicker } from "@mui/x-date-pickers";
import moment from "moment/moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
//import moment from "moment-timezone";
//import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import {Create} from "../../api/Function"
import {Edit} from "../../api/Function"
const times = Array.from({ length: 48 }, (_, index) =>
  moment()
    .startOf("day")
    .add(30 * index, "minutes")
    .format("HH:mm")
);

const Dashboard = () => {
  const [availability, setAvailability] = useState({
    Monday: { active: true, slots: [{ start: "09:00", end: "10:00" }] },
    Tuesday: { active: true, slots: [{ start: "09:00", end: "10:00" }] },
    Wednesday: { active: true, slots: [{ start: "09:00", end: "10:00"  }] },
    Thursday: { active: true, slots: [{ start: "09:00", end: "10:00"  }] },
    Friday: { active: true, slots: [{ start: "09:00",end: "10:00"  }] },
    Saturday: { active: false, slots: [{ start: "09:00", end: "10:00"  }] },
    Sunday: { active: false, slots: [{ start: "09:00",end: "10:00" }] },
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duration, setDuration] = useState(60); // Default duration in minutes
  const [slots, setSlots] = useState([{ start: "09:00", end: "10:00" }]);
  const [scheduleType, setScheduleType] = useState("weekly"); // "weekly" or "monthly"
  const [dateRange, setDateRange] = useState([null,null]);
  const [dateSlots, setDateSlots] = useState([{ start: "09:00", end: "10:00" }]);
  //const [availability, setAvailability] = useState({});
// Fetch default availability from API
useEffect(() => {
  const fetchAvailability = async () => {
    try {
      const response = await fetch("/api/getDefaultSlots"); // Replace with your API endpoint
      const data = await response.json();
      const defaultAvailability = data.defaultSlots;

      const formattedAvailability = {
        Monday: { active: true, slots: [...defaultAvailability] },
        Tuesday: { active: true, slots: [...defaultAvailability] },
        Wednesday: { active: true, slots: [...defaultAvailability] },
        Thursday: { active: true, slots: [...defaultAvailability] },
        Friday: { active: true, slots: [...defaultAvailability] },
        Saturday: { active: false, slots: [] },
        Sunday: { active: false, slots: [] },
      };

      setAvailability(formattedAvailability);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  fetchAvailability();
}, []);
 // Update slots for the selected date
 const handleDateSlotChange = (index, key, value) => {
  const updatedSlots = [...dateSlots];
  updatedSlots[index][key] = value;
  if (key === "start") {
    updatedSlots[index].end = moment(value, "HH:mm")
      .add(duration, "minutes")
      .format("HH:mm");
  }
  setDateSlots(updatedSlots);
};

// Add or remove slots for the selected date
const addDateSlot = () => {
  setDateSlots([...dateSlots, { start: "09:00", end: "10:00" }]);
};

const removeDateSlot = (index) => {
  if (dateSlots.length > 1) {
    setDateSlots(dateSlots.filter((_, i) => i !== index));
  }
};

// Save date-specific slots
const handleSaveDateSlots = () => {
  console.log("Saved slots for", selectedDate, dateSlots);
  setIsModalOpen(false);
};

  // useEffect(() => {
  //   fetchDefaultData();
  // }, []);
  const addSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "", end: "" }],
      },
    }));
  };
  const handleStartDateChange = (newDate) => {
    setDateRange([newDate, dateRange[1]]);
  };

  const handleEndDateChange = (newDate) => {
    setDateRange([dateRange[0], newDate]);
  };

  const removeSlot = (day, index) => {
    setAvailability((prev) => {
      const updatedSlots = [...prev[day].slots];
      updatedSlots.splice(index, 1);
      return {
        ...prev,
        [day]: { ...prev[day], slots: updatedSlots },
      };
    });
  };
//   const fetchDefaultData = async () => {
//     try {
//       // const response = await axios.get("http://localhost:3002/schedule", {
//       //   params: { scheduleType },
//       // });
//  const response = await Edit( { params: { scheduleType },})||null

//       if (response.data) {
//         setAvailability(response.data.availability);
//         setDateRange(response.data.dateRange || [null,null]);
//       }
//     } catch (error) {
//       console.error("Error fetching default data:", error);
//     }
//   };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    setDuration(newDuration);
    // Update end times for all slots
    // setSlots((prevSlots) =>
    //   prevSlots.map((slot) => ({
    //     ...slot,
    //     end: moment(slot.start, "HH:mm")
    //       .add(newDuration, "minutes")
    //       .format("HH:mm"),
    //   }))
    // );
setSlots([{ start: "09:00", end: "10:00" }])
  };

  const handleAddSlot = () => {
    setSlots((prev) => [
      ...prev,
      {
        start: "",
        end: moment("", "HH:mm").add(duration, "minutes").format("HH:mm"),
      },
    ]);
  };

  const handleRemoveSlot = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSendUpdatedData = async () => {
    try {
      // // Construct the payload
      // const payload = Object.entries(availability).map(([day, { slots, active }]) => {
      //   if (!active) return null; // Skip inactive days
  
      //   return {
      //     schedule_id: day.toLowerCase(), // Use the day's name as an example `schedule_id`
      //     time_slots: slots.map((slot) => ({
      //       start_time: moment(slot.start, "HH:mm").utc().toISOString(), // Convert to UTC
      //       end_time: moment(slot.end, "HH:mm").utc().toISOString(), // Convert to UTC
      //     })),
      //     duration, // Use the selected duration
      //   };
      // }).filter(Boolean); // Remove null entries
      const payload = Object.entries(availability)
      .map(([day, { slots, active }]) => {
        if (!active) return null; // Skip inactive days
        return {
          schedule_id: day.toLowerCase(),
          time_slots: slots.map((slot) => ({
            start_time: moment(slot.start, "HH:mm").utc().toISOString(),
            end_time: moment(slot.end, "HH:mm").utc().toISOString(),
          })),
          duration, 
        };
      })
      .filter(Boolean); // Remove null entries
    
      console.log("Payload:", payload); // Debugging purpose
  
      const response = await Edit(payload);
  
      if (response.status === 200 || response.status === 204) {
        alert("Updated data sent successfully!");
      } else {
        alert("Failed to send updated data.");
      }
    } catch (error) {
      console.error("Error sending updated data:", error);
      alert("An error occurred while sending updated data.");
    }
  };
  
  // const handleSendUpdatedData = async () => {
  //   try {
  //     // Construct the payload
  //     const payload = Object.entries(availability).map(([day, { slots, active }]) => {
  //       if (!active) return null; // Skip inactive days
  
  //       return {
  //         schedule_id: day.toLowerCase(), // Use the day's name as an example `schedule_id`
  //         time_slots: slots.map((slot) => ({
  //           start_time: moment(slot.start, "HH:mm").utc().toISOString(), // Convert to UTC
  //           end_time: moment(slot.end, "HH:mm").utc().toISOString(), // Convert to UTC
  //         })),
  //         duration, // Use the selected duration
  //       };
  //     }).filter(Boolean); // Remove null entries
  
  //     console.log("Payload:", payload); // Debugging purpose
  
  //     // Make the PATCH request
  //     const response = await axios.patch("https://api.example.com/update-schedule", payload, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  
  //     if (response.status === 200 || response.status === 204) {
  //       alert("Updated data sent successfully!");
  //     } else {
  //       alert("Failed to send updated data.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending updated data:", error);
  //     alert("An error occurred while sending updated data.");
  //   }
  // };
  
  const handleSave = async () => {
    try {
      
      let startDate = moment().startOf("day"); // Today's start
      // Today's start in user's timezone
      let endDate;

      if (scheduleType === "weekly") {
        //endDate = moment().add(6, "days").endOf("day");
        endDate = moment().endOf("week");
      } else if (scheduleType === "monthly") {
        //endDate = moment().add(29, "days").endOf("day"); // Monthly (30 days)
        endDate = moment().endOf("month"); // Last date of the current month
      } else if (scheduleType === "custom") {
       // if (dateRange.length === 2) {
          // endDate = moment(dateRange[1]).endOf("day");

        //   const [customStart, customEnd] = dateRange;
        //   startDate = moment(customStart).startOf("day");
        //   endDate = moment(customEnd).endOf("day");
        // }
        if (dateRange[0] && dateRange[1]) {
          startDate = moment(dateRange[0]).startOf("day");
          endDate = moment(dateRange[1]).endOf("day");
        }
        else {
          alert("Please select a valid date range for custom scheduling.");
          return;
        }
      }
     
      // Generate dates between start and end
      const dates = [];
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.clone().toISOString()); // Add the date in ISO format
        currentDate.add(1, "day");
      }

      // Create the payload
      const payload = dates.map((date) => ({
        date: moment(date).utc().toISOString(), // Specific date
        time_slots: slots.map((slot) => ({
          start_time: moment(date)
            .set({
              hour: moment(slot.start, "HH:mm").hours(),
              minute: moment(slot.start, "HH:mm").minutes(),
            }).utc()
            .toISOString(),
          end_time: moment(date)
            .set({
              hour: moment(slot.end, "HH:mm").hours(),
              minute: moment(slot.end, "HH:mm").minutes(),
            })
            .utc()
         
        })),
        duration,
      }));

      console.log("Generated Payload:", JSON.stringify(payload, null, 2));

      const response =await Create(payload)

      if (response.status === 200 || response.status === 201) {
        alert("Default slots saved successfully!");
      //         if (response.data) {
      //   setAvailability(response.data.availability);
      // }
        //fetchDefaultData(); // Refresh the data
      } else {
        alert("Failed to save default slots.");
      }
    } catch (error) {
      console.error("Error saving default slots:", error);
      alert("An error occurred while saving default slots.");
    }
  };
  
  const getDisabledTimes = () => {
    const disabledTimes = new Set();
    const now = moment().format("HH:mm");
    times.forEach((time) => {
      if (time < now) {
        disabledTimes.add(time);
      }
    });
  
    slots.forEach((slot) => {
      const slotStart = moment(slot.start, "HH:mm");
      const slotEnd = moment(slot.end, "HH:mm");
  
      times.forEach((time) => {
        const currentTime = moment(time, "HH:mm");
        if (
          currentTime.isBetween(slotStart, slotEnd, "minutes", "[)") || // Overlaps start or within
          currentTime.clone().add(duration, "minutes").isBetween(slotStart, slotEnd, "minutes", "[)") // Overlaps end after adding duration
        ) {
          disabledTimes.add(time);
        }
      });
    });
  
    return disabledTimes;
  };
  
  const getDisabledDays = () =>{
  const daysMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

    return Object.keys(availability)
      .filter((day) => !availability[day]?.active)
      .map((day) => daysMap[day]);
  }
  return (
    <Box sx={{ padding: "10px", margin: "auto",}}>
      {/* Header */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Schedule
      </Typography>
      {/* here code for additional changes*/}

      <Box sx={{display:"flex",justifyContent:"space-between"}}>
      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{
          mb: 1,
          "& .MuiTabs-indicator": { backgroundColor: "#8E50FB" },color:"#8E50FB"
        }}
      >
        <Tab label="Week Days" sx={{color:"#8E50FB"}}/>
        <Tab label="Holidays"  sx={{color:"#8E50FB"}}/>
         {/* Buttons */}
     
      </Tabs>

      <Box sx={{ textAlign: "right", mb: 1 ,display:"flex",gap:"10px"}}>
        <Button variant="contained" sx={{ mr: 2,backgroundColor:"#8E50FB"}} onClick={handleSendUpdatedData}
>
          Save Updated Data
        </Button>
        <Button variant="outlined" color="inherit">
          Cancel
        </Button>
      </Box>
      {/* Week Hours & Calendar */}
      </Box>
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {" "}
        <Box
          sx={{ mb: 4, p: 2, border: "1px solid #e0e0e0", borderRadius: "8px" }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Default Slot Configuration
          </Typography>


          {/* Duration Selector */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Select Duration (in minutes):
            </Typography>
            <TextField
              select
              size="small"
              value={duration}
              onChange={handleDurationChange}
              sx={{ width: "150px", mt: 1 }}
            >
              {[30, 45, 60, 90, 120].map((value) => (
                <MenuItem key={value} value={value}>
                  {value} mins
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* Radio Buttons for Schedule Type */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Set for:</Typography>
            <RadioGroup
              row
              value={scheduleType}
              onChange={(e) => {
                setScheduleType(e.target.value);
                setDateRange([null,null]); // Reset date range on change
                setSlots([{ start: "09:00", end: "10:00" }])
                
              }}
            >
              <FormControlLabel
                value="weekly"
                control={<Radio />}
                label="Week"
                sx={{ '&.Mui-checked': { color: '#8E50FB' } }}
              />
              <FormControlLabel
                value="monthly"
                control={<Radio />}
                label="Month"
                sx={{ '&.Mui-checked': { color: '#8E50FB' } }}
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="Customize"
                sx={{ '&.Mui-checked': { color: '#8E50FB' } }}
              />
            </RadioGroup>
            {scheduleType === "custom" && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <DatePicker
                label="Start Date"
                value={dateRange[0]}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>
          )}
          </Box>
          {/* Slots */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Time Slots:</Typography>
            {slots.map((slot, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
              >
                <TextField
                  select
                  size="small"
                  value={slot.start}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setSlots((prev) =>
                      prev.map((s, i) =>
                        i === index
                          ? {
                              ...s,
                              start: newStart,
                              end: moment(newStart, "HH:mm")
                                .add(duration, "minutes")
                                .format("HH:mm"),
                            }
                          : s
                      )
                    );
                  }}
                  sx={{ flex: 1 }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Set max height for dropdown
                          width: 150, // Set consistent width
                        },
                      },
                    },
                  }}
                >
                  {times.map((time) => (
                    <MenuItem
                      key={time}
                      value={time}
                     //disabled={getDisabledTimes().has(time)
                     disabled={getDisabledTimes().has(time)}
                    >
                      {time}
                    </MenuItem>
                    
                  ))}
                </TextField>
                <TextField
                  size="small"
                  value={slot.end}
                  disabled // End time is automatically calculated
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={() => handleRemoveSlot(index)}
                  disabled={slots.length <= 1}
                  sx={{color:"red"}}
                >
                   <RiDeleteBin5Line                  
/>
                </IconButton>
                {index === slots.length - 1 && (
                  <IconButton   sx={{color:"#8E50FB"}} onClick={handleAddSlot}
                >
                    <AiOutlinePlusCircle   sx={{color:"background: #8E50FB"}}/>
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          {/* Save Button */}
          <Box sx={{ textAlign: "right" }}>
            <Button  onClick={handleSave}                   sx={{backgroundColor:"#8E50FB",color:"white"}}
>
              Save Default Slots
            </Button>
          </Box>
        </Box>
        {/* Week Hours */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>  
            Week Hours
          </Typography>
          {Object.keys(availability).map((day) => (
            <Box
              key={day}
              sx={{
                display: "flex",
                alignItems: "center",
                m: 2,
                border: "1px solid #e0e0e0",
                p: 2,
              }}
            >
              <Switch sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#8E50FB", }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8E50FB", }, }}
                checked={availability[day]?.active||false}
                onChange={(e) =>
                  setAvailability((prev) => ({
                    ...prev,
                    [day]: { ...prev[day], active: e.target.checked },
                  }))
                }
              />
              <Typography sx={{ fontWeight: "500", width: "100px" }}>
                {day}
              </Typography>
              {availability[day]?.active && (
                <Box sx={{ flex: 1 }}>
                  {availability[day].slots.map((slot, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <TextField
                        select
                        size="small"
                        value={slot.start}
                        onChange={(e) => {
                          const updatedSlots = [...availability[day].slots];
                          updatedSlots[index].start = e.target.value;
                          setAvailability((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], slots: updatedSlots },
                          }));
                        }}
                        sx={{ flex: 1 }} SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200, 
                           width: 150,
                            }, }, }, }} >
        
                        {times.map((time) => (
                          <MenuItem key={time} value={time} 
                          //disabled={getDisabledTimes(availability[day].slots).has(time)}
                          >
                            {time}
                          </MenuItem>
                        ))}
                      </TextField>
{
  /*
  import React, { useState } from 'react';
import { TextField, MenuItem, IconButton, Box, Typography, Button } from '@mui/material';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import getDisabledTimes from './path/to/getDisabledTimes';
import moment from 'moment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

const Dashboard = () => {
  const [slots, setSlots] = useState([{ start: "09:00", end: "10:00" }]);
  const [times, setTimes] = useState(["08:00", "09:00", "10:00", "11:00"]);
  const [duration, setDuration] = useState(60); // Duration in minutes

  const handleAddSlot = () => {
    setSlots([...slots, { start: "09:00", end: "10:00" }]);
  };

    
                <MenuItem key={time} value={time} disabled={getDisabledTimes(slots, times, duration).has(time)}>
                  {time}
                </MenuItem>
             
           
  */
}
                      <TextField
                        select
                        size="small"
                        value={slot.end}                 
                        onChange={(e) => {
                          const updatedSlots = [...availability[day].slots];
                          updatedSlots[index].end = e.target.value;
                          setAvailability((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], slots: updatedSlots },
                          }));
                        }}

 sx={{ flex: 1 }} SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200, 
                           width: 150,
                            }, }, }, }}                      >
                        {times.map((time) => (
                          <MenuItem key={time} value={time}
                          >
                            {time}
                          </MenuItem>
                        ))}
                      </TextField>
                      <IconButton
                        onClick={() => removeSlot(day, index)}
                        disabled={availability[day].slots.length <= 1}
                        sx={{color:"red"}}
                      >
                        <RiDeleteBin5Line 
/>

                      </IconButton>
                      {index === availability[day].slots.length - 1 && (
                        <IconButton
                          onClick={() => addSlot(day)}
                          sx={{color:"#8E50FB"}}
                          >
                          <AiOutlinePlusCircle />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {/* Calendar */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
            Calendar
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              disablePast
              shouldDisableDate={(date) => {
                const dayIndex = date.getDay();
                return getDisabledDays().includes(dayIndex);
              }}
              minDate={new Date()} // Today is the minimum selectable date
              maxDate={
                scheduleType === "weekly"
                  ? moment().add(6, "days").toDate()
                  : moment().add(29, "days").toDate() 
              }
              sx={{
                '.MuiPickersDay-root': {
                  '&.Mui-selected': {
                    backgroundColor: '#8E50FB', // Desired background color
                    borderRadius: '0%', // Make the shape square
                  },
                },
              }}
    
            />
          </LocalizationProvider>
        </Box>
          {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" component="h2">
            Manage Slots for:
          </Typography>
          <Typography variant="h6" component="h2">
         {selectedDate?.toDateString()}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {dateSlots.map((slot, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: "10px", alignItems: "center", mb: 1 }}
              >
                <TextField
                  select
                  size="small"
                  value={slot.start}
                  onChange={(e) => handleDateSlotChange(index, "start", e.target.value)}
                  sx={{ flex: 1 }}
                >
                  {times.map((time) => (
                    <MenuItem key={time} value={time}                       
                    disabled={getDisabledTimes(dateSlots).has(time)}
                    >
                      {time}                      

                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  value={slot.end}
                  disabled // End time is automatically calculated
                  sx={{ flex: 1 }}
                />
                <IconButton onClick={() => removeDateSlot(index)} sx={{color:"red"}}>
                <RiDeleteBin5Line />
                </IconButton>
                {index === dateSlots.length - 1 && (
                  <IconButton onClick={addDateSlot} sx={{color:"#8E50FB"}}>
                    <AiOutlinePlusCircle />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 3,display:"flex",gap:"20px"} }>
            <Button variant="contained" onClick={handleSaveDateSlots}sx={{backgroundColor:"#8E50FB"}}>
              Save Slots
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
          
        </Box>
      </Modal>
      </Box>



      
    </Box>
  );
};

export default Dashboard;


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Switch,
//   Button,
//   TextField,
//   IconButton,
//   MenuItem,
//   Tabs,
//   Tab,
//   Typography,
//   Modal,
// } from "@mui/material";
// //import DatePicker from "react-multi-date-picker";
// import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
// import { LocalizationProvider, DateCalendar,DatePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import moment from "moment-timezone";
// //import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// import {Create} from "../../api/Function"
// import {Edit} from "../../api/Function"
// const times = Array.from({ length: 48 }, (_, index) =>
//   moment()
//     .startOf("day")
//     .add(30 * index, "minutes")
//     .format("HH:mm")
// );

// const Dashboard = () => {
//   const [availability, setAvailability] = useState({
//     Monday: { active: true, slots: [{ start: "09:00", end: "10:00" }] },
//     Tuesday: { active: true, slots: [{ start: "09:00", end: "10:00" }] },
//     Wednesday: { active: true, slots: [{ start: "09:00", end: "10:00"  }] },
//     Thursday: { active: true, slots: [{ start: "09:00", end: "10:00"  }] },
//     Friday: { active: true, slots: [{ start: "09:00",end: "10:00"  }] },
//     Saturday: { active: false, slots: [{ start: "09:00", end: "10:00"  }] },
//     Sunday: { active: false, slots: [{ start: "09:00",end: "10:00" }] },
//   });
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [duration, setDuration] = useState(60); // Default duration in minutes
//   const [slots, setSlots] = useState([{ start: "09:00", end: "10:00" }]);
//   const [scheduleType, setScheduleType] = useState("weekly"); // "weekly" or "monthly"
//   const [dateRange, setDateRange] = useState([null,null]);
//   const [dateSlots, setDateSlots] = useState([{ start: "09:00", end: "10:00" }]);
//   //const [availability, setAvailability] = useState({});
// // Fetch default availability from API
// useEffect(() => {
//   const fetchAvailability = async () => {
//     try {
//       const response = await fetch("/api/getDefaultSlots"); // Replace with your API endpoint
//       const data = await response.json();
//       const defaultAvailability = data.defaultSlots;

//       const formattedAvailability = {
//         Monday: { active: true, slots: [...defaultAvailability] },
//         Tuesday: { active: true, slots: [...defaultAvailability] },
//         Wednesday: { active: true, slots: [...defaultAvailability] },
//         Thursday: { active: true, slots: [...defaultAvailability] },
//         Friday: { active: true, slots: [...defaultAvailability] },
//         Saturday: { active: false, slots: [] },
//         Sunday: { active: false, slots: [] },
//       };

//       setAvailability(formattedAvailability);
//     } catch (error) {
//       console.error("Error fetching availability data:", error);
//     }
//   };

//   fetchAvailability();
// }, []);
//  // Update slots for the selected date
//  const handleDateSlotChange = (index, key, value) => {
//   const updatedSlots = [...dateSlots];
//   updatedSlots[index][key] = value;
//   if (key === "start") {
//     updatedSlots[index].end = moment(value, "HH:mm")
//       .add(duration, "minutes")
//       .format("HH:mm");
//   }
//   setDateSlots(updatedSlots);
// };

// // Add or remove slots for the selected date
// const addDateSlot = () => {
//   setDateSlots([...dateSlots, { start: "09:00", end: "10:00" }]);
// };

// const removeDateSlot = (index) => {
//   if (dateSlots.length > 1) {
//     setDateSlots(dateSlots.filter((_, i) => i !== index));
//   }
// };

// // Save date-specific slots
// const handleSaveDateSlots = () => {
//   console.log("Saved slots for", selectedDate, dateSlots);
//   setIsModalOpen(false);
// };

//   // useEffect(() => {
//   //   fetchDefaultData();
//   // }, []);
//   const addSlot = (day) => {
//     setAvailability((prev) => ({
//       ...prev,
//       [day]: {
//         ...prev[day],
//         slots: [...prev[day].slots, { start: "", end: "" }],
//       },
//     }));
//   };
//   const handleStartDateChange = (newDate) => {
//     setDateRange([newDate, dateRange[1]]);
//   };

//   const handleEndDateChange = (newDate) => {
//     setDateRange([dateRange[0], newDate]);
//   };

//   const removeSlot = (day, index) => {
//     setAvailability((prev) => {
//       const updatedSlots = [...prev[day].slots];
//       updatedSlots.splice(index, 1);
//       return {
//         ...prev,
//         [day]: { ...prev[day], slots: updatedSlots },
//       };
//     });
//   };
// //   const fetchDefaultData = async () => {
// //     try {
// //       // const response = await axios.get("http://localhost:3002/schedule", {
// //       //   params: { scheduleType },
// //       // });
// //  const response = await Edit( { params: { scheduleType },})||null

// //       if (response.data) {
// //         setAvailability(response.data.availability);
// //         setDateRange(response.data.dateRange || [null,null]);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching default data:", error);
// //     }
// //   };
//   const handleDateChange = (newDate) => {
//     setSelectedDate(newDate);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleDurationChange = (e) => {
//     const newDuration = parseInt(e.target.value, 10);
//     setDuration(newDuration);
//     // Update end times for all slots
//     // setSlots((prevSlots) =>
//     //   prevSlots.map((slot) => ({
//     //     ...slot,
//     //     end: moment(slot.start, "HH:mm")
//     //       .add(newDuration, "minutes")
//     //       .format("HH:mm"),
//     //   }))
//     // );
// setSlots([{ start: "09:00", end: "10:00" }])
//   };

//   const handleAddSlot = () => {
//     setSlots((prev) => [
//       ...prev,
//       {
//         start: "",
//         end: moment("", "HH:mm").add(duration, "minutes").format("HH:mm"),
//       },
//     ]);
//   };

//   const handleRemoveSlot = (index) => {
//     setSlots((prev) => prev.filter((_, i) => i !== index));
//   };
//   const handleSendUpdatedData = async () => {
//     try {
//       // // Construct the payload
//       // const payload = Object.entries(availability).map(([day, { slots, active }]) => {
//       //   if (!active) return null; // Skip inactive days
  
//       //   return {
//       //     schedule_id: day.toLowerCase(), // Use the day's name as an example `schedule_id`
//       //     time_slots: slots.map((slot) => ({
//       //       start_time: moment(slot.start, "HH:mm").utc().toISOString(), // Convert to UTC
//       //       end_time: moment(slot.end, "HH:mm").utc().toISOString(), // Convert to UTC
//       //     })),
//       //     duration, // Use the selected duration
//       //   };
//       // }).filter(Boolean); // Remove null entries
//       const payload = Object.entries(availability)
//       .map(([day, { slots, active }]) => {
//         if (!active) return null; // Skip inactive days
//         return {
//           schedule_id: day.toLowerCase(),
//           time_slots: slots.map((slot) => ({
//             start_time: moment(slot.start, "HH:mm").utc().toISOString(),
//             end_time: moment(slot.end, "HH:mm").utc().toISOString(),
//           })),
//           duration, 
//         };
//       })
//       .filter(Boolean); // Remove null entries
    
//       console.log("Payload:", payload); // Debugging purpose
  
//       const response = await Edit(payload);
  
//       if (response.status === 200 || response.status === 204) {
//         alert("Updated data sent successfully!");
//       } else {
//         alert("Failed to send updated data.");
//       }
//     } catch (error) {
//       console.error("Error sending updated data:", error);
//       alert("An error occurred while sending updated data.");
//     }
//   };
  
//   // const handleSendUpdatedData = async () => {
//   //   try {
//   //     // Construct the payload
//   //     const payload = Object.entries(availability).map(([day, { slots, active }]) => {
//   //       if (!active) return null; // Skip inactive days
  
//   //       return {
//   //         schedule_id: day.toLowerCase(), // Use the day's name as an example `schedule_id`
//   //         time_slots: slots.map((slot) => ({
//   //           start_time: moment(slot.start, "HH:mm").utc().toISOString(), // Convert to UTC
//   //           end_time: moment(slot.end, "HH:mm").utc().toISOString(), // Convert to UTC
//   //         })),
//   //         duration, // Use the selected duration
//   //       };
//   //     }).filter(Boolean); // Remove null entries
  
//   //     console.log("Payload:", payload); // Debugging purpose
  
//   //     // Make the PATCH request
//   //     const response = await axios.patch("https://api.example.com/update-schedule", payload, {
//   //       headers: { "Content-Type": "application/json" },
//   //     });
  
//   //     if (response.status === 200 || response.status === 204) {
//   //       alert("Updated data sent successfully!");
//   //     } else {
//   //       alert("Failed to send updated data.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error sending updated data:", error);
//   //     alert("An error occurred while sending updated data.");
//   //   }
//   // };
  
//   const handleSave = async () => {
//     try {
      
//       let startDate = moment().startOf("day"); // Today's start
//       // Today's start in user's timezone
//       let endDate;

//       if (scheduleType === "weekly") {
//         //endDate = moment().add(6, "days").endOf("day");
//         endDate = moment().endOf("week");
//       } else if (scheduleType === "monthly") {
//         //endDate = moment().add(29, "days").endOf("day"); // Monthly (30 days)
//         endDate = moment().endOf("month"); // Last date of the current month
//       } else if (scheduleType === "custom") {
//        // if (dateRange.length === 2) {
//           // endDate = moment(dateRange[1]).endOf("day");

//         //   const [customStart, customEnd] = dateRange;
//         //   startDate = moment(customStart).startOf("day");
//         //   endDate = moment(customEnd).endOf("day");
//         // }
//         if (dateRange[0] && dateRange[1]) {
//           startDate = moment(dateRange[0]).startOf("day");
//           endDate = moment(dateRange[1]).endOf("day");
//         }
//         else {
//           alert("Please select a valid date range for custom scheduling.");
//           return;
//         }
//       }
     
//       // Generate dates between start and end
//       const dates = [];
//       let currentDate = startDate.clone();
//       while (currentDate.isSameOrBefore(endDate)) {
//         dates.push(currentDate.clone().toISOString()); // Add the date in ISO format
//         currentDate.add(1, "day");
//       }

//       // Create the payload
//       const payload = dates.map((date) => ({
//         date: moment(date).utc().toISOString(), // Specific date
//         time_slots: slots.map((slot) => ({
//           start_time: moment(date)
//             .set({
//               hour: moment(slot.start, "HH:mm").hours(),
//               minute: moment(slot.start, "HH:mm").minutes(),
//             }).utc()
//             .toISOString(),
//           end_time: moment(date)
//             .set({
//               hour: moment(slot.end, "HH:mm").hours(),
//               minute: moment(slot.end, "HH:mm").minutes(),
//             })
//             .utc()
         
//         })),
//         duration,
//       }));

//       console.log("Generated Payload:", JSON.stringify(payload, null, 2));

//       const response =await Create(payload)

//       if (response.status === 200 || response.status === 201) {
//         alert("Default slots saved successfully!");
//       //         if (response.data) {
//       //   setAvailability(response.data.availability);
//       // }
//         //fetchDefaultData(); // Refresh the data
//       } else {
//         alert("Failed to save default slots.");
//       }
//     } catch (error) {
//       console.error("Error saving default slots:", error);
//       alert("An error occurred while saving default slots.");
//     }
//   };
  
//   const getDisabledTimes = (slots) => {
//     const disabledTimes = new Set();
//     const now = moment().format("HH:mm");
//     times.forEach((time) => {
//       if (time < now) {
//         disabledTimes.add(time);
//       }
//     });
  
//     slots.forEach((slot) => {
//       const slotStart = moment(slot.start, "HH:mm");
//       const slotEnd = moment(slot.end, "HH:mm");
  
//       times.forEach((time) => {
//         const currentTime = moment(time, "HH:mm");
//         if (
//           currentTime.isBetween(slotStart, slotEnd, "minutes", "[)") || // Overlaps start or within
//           currentTime.clone().add(duration, "minutes").isBetween(slotStart, slotEnd, "minutes", "[)") // Overlaps end after adding duration
//         ) {
//           disabledTimes.add(time);
//         }
//       });
//     });
  
//     return disabledTimes;
//   };

//   return (
//     <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
//       {/* Header */}
//       <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
//         Schedule
//       </Typography>
//       {/* here code for additional changes*/}
//       {/* Tabs */}
//       <Tabs
//         value={selectedTab}
//         onChange={(e, newValue) => setSelectedTab(newValue)}
//         sx={{
//           mb: 3,
//           "& .MuiTabs-indicator": { backgroundColor: "secondary.main" },
//         }}
//       >
//         <Tab label="Week Days" />
//         <Tab label="Holidays" />
//       </Tabs>
//       {/* Week Hours & Calendar */}
//       <Box
//         sx={{
//           border: "1px solid #e0e0e0",
//           borderRadius: "8px",
//           padding: "20px",
//           display: "flex",
//           gap: "20px",
//         }}
//       >
//         {" "}
//         <Box
//           sx={{ mb: 4, p: 2, border: "1px solid #e0e0e0", borderRadius: "8px" }}
//         >
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Default Slot Configuration
//           </Typography>


//           {/* Duration Selector */}
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle1">
//               Select Duration (in minutes):
//             </Typography>
//             <TextField
//               select
//               size="small"
//               value={duration}
//               onChange={handleDurationChange}
//               sx={{ width: "150px", mt: 1 }}
//             >
//               {[30, 45, 60, 90, 120].map((value) => (
//                 <MenuItem key={value} value={value}>
//                   {value} mins
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>

//           {/* Radio Buttons for Schedule Type */}
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle1">Set for:</Typography>
//             <RadioGroup
//               row
//               value={scheduleType}
//               onChange={(e) => {
//                 setScheduleType(e.target.value);
//                 setDateRange([null,null]); // Reset date range on change
//                 setSlots([{ start: "09:00", end: "10:00" }])

//               }}
//             >
//               <FormControlLabel
//                 value="weekly"
//                 control={<Radio />}
//                 label="Week"
//               />
//               <FormControlLabel
//                 value="monthly"
//                 control={<Radio />}
//                 label="Month"
//               />
//               <FormControlLabel
//                 value="custom"
//                 control={<Radio />}
//                 label="Customize"
//               />
//             </RadioGroup>
//             {scheduleType === "custom" && (
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box sx={{ display: 'flex', gap: '1rem' }}>
//               <DatePicker
//                 label="Start Date"
//                 value={dateRange[0]}
//                 onChange={handleStartDateChange}
//                 renderInput={(params) => <TextField {...params} />}
//               />
//               <DatePicker
//                 label="End Date"
//                 value={dateRange[1]}
//                 onChange={handleEndDateChange}
//                 renderInput={(params) => <TextField {...params} />}
//               />
//             </Box>
//           </LocalizationProvider>
//           )}
//           </Box>
//           {/* Date Range Picker */}
//           {/* <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle1">Select Date Range:</Typography>
//             <DatePicker
//               range
//               value={dateRange}
//               onChange={setDateRange}
//               minDate={new Date()} // Disable dates before today
//               maxDate={
//                 scheduleType === "weekly"
//                   ? moment().endOf("week").toDate() // End of the current week
//                   : scheduleType === "monthly"
//                   ? moment().endOf("month").toDate() // End of the current month
//                   : null // No limit for custom
//               }
//               disabled={scheduleType === "weekly" || scheduleType === "monthly"}
//               style={{ marginTop: "8px" }}
//             />
//           </Box> */}
//           {/* Slots */}
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle1">Time Slots:</Typography>
//             {slots.map((slot, index) => (
//               <Box
//                 key={index}
//                 sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
//               >
//                 <TextField
//                   select
//                   size="small"
//                   value={slot.start}
//                   onChange={(e) => {
//                     const newStart = e.target.value;
//                     setSlots((prev) =>
//                       prev.map((s, i) =>
//                         i === index
//                           ? {
//                               ...s,
//                               start: newStart,
//                               end: moment(newStart, "HH:mm")
//                                 .add(duration, "minutes")
//                                 .format("HH:mm"),
//                             }
//                           : s
//                       )
//                     );
//                   }}
//                   sx={{ flex: 1 }}
//                   SelectProps={{
//                     MenuProps: {
//                       PaperProps: {
//                         style: {
//                           maxHeight: 200, // Set max height for dropdown
//                           width: 150, // Set consistent width
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   {times.map((time) => (
//                     <MenuItem
//                       key={time}
//                       value={time}
//                      //disabled={getDisabledTimes().has(time)
//                      disabled={getDisabledTimes(slots).has(time)}
//                     >
//                       {time}
//                     </MenuItem>
                    
//                   ))}
//                 </TextField>
//                 <TextField
//                   size="small"
//                   value={slot.end}
//                   disabled // End time is automatically calculated
//                   sx={{ flex: 1 }}
//                 />
//                 <IconButton
//                   color="secondary"
//                   onClick={() => handleRemoveSlot(index)}
//                   disabled={slots.length <= 1}
//                 >
//                   <AiOutlineMinusCircle />
//                 </IconButton>
//                 {index === slots.length - 1 && (
//                   <IconButton color="primary" onClick={handleAddSlot}>
//                     <AiOutlinePlusCircle />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}
//           </Box>
// {
//   /*
//   <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle1">Time Slots:</Typography>
//             {slots.map((slot, index) => (
//               <Box
//                 key={index}
//                 sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
//               >
//                 <TextField
//                   select
//                   size="small"
//                   value={slot.start}
//                   onChange={(e) => {
//                     const newStart = e.target.value;
//                     setSlots((prev) =>
//                       prev.map((s, i) =>
//                         i === index
//                           ? {
//                               ...s,
//                               start: newStart,
//                               end: moment(newStart, "HH:mm")
//                                 .add(duration, "minutes")
//                                 .format("HH:mm"),
//                             }
//                           : s
//                       )
//                     );
//                   }}
//                   sx={{ flex: 1 }}
//                   SelectProps={{
//                     MenuProps: {
//                       PaperProps: {
//                         style: {
//                           maxHeight: 200, // Set max height for dropdown
//                           width: 150, // Set consistent width
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   {times.map((time) => (
//                     <MenuItem
//                       key={time}
//                       value={time}
//                      //disabled={getDisabledTimes().has(time)
//                      disabled={getDisabledTimes(slots).has(time)}
//                     >
//                       {time}
//                     </MenuItem>
                    
//                   ))}
//                 </TextField>
//                 <TextField
//                   size="small"
//                   value={slot.end}
//                   disabled // End time is automatically calculated
//                   sx={{ flex: 1 }}
//                 />
//                 <IconButton
//                   color="secondary"
//                   onClick={() => handleRemoveSlot(index)}
//                   disabled={slots.length <= 1}
//                 >
//                   <AiOutlineMinusCircle />
//                 </IconButton>
//                 {index === slots.length - 1 && (
//                   <IconButton color="primary" onClick={handleAddSlot}>
//                     <AiOutlinePlusCircle />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}
//           </Box>
//   */
// }

//           {/* Save Button */}
//           <Box sx={{ textAlign: "right" }}>
//             <Button variant="contained" onClick={handleSave}>
//               Save Default Slots
//             </Button>
//           </Box>
//         </Box>
//         {/* Week Hours */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>  
//             Week Hours
//           </Typography>
//           {Object.keys(availability).map((day) => (
//             <Box
//               key={day}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 2,
//                 borderBottom: "1px solid #e0e0e0",
//                 pb: 2,
//               }}
//             >
//               <Switch
//                 checked={availability[day]?.active||false}
//                 color="secondary"
//                 onChange={(e) =>
//                   setAvailability((prev) => ({
//                     ...prev,
//                     [day]: { ...prev[day], active: e.target.checked },
//                   }))
//                 }
//               />
//               <Typography sx={{ fontWeight: "500", width: "100px" }}>
//                 {day}
//               </Typography>
//               {availability[day]?.active && (
//                 <Box sx={{ flex: 1 }}>
//                   {availability[day].slots.map((slot, index) => (
//                     <Box
//                       key={index}
//                       sx={{
//                         display: "flex",
//                         gap: "10px",
//                         alignItems: "center",
//                         mb: 1,
//                       }}
//                     >
//                       <TextField
//                         select
//                         size="small"
//                         value={slot.start}
//                         onChange={(e) => {
//                           const updatedSlots = [...availability[day].slots];
//                           updatedSlots[index].start = e.target.value;
//                           setAvailability((prev) => ({
//                             ...prev,
//                             [day]: { ...prev[day], slots: updatedSlots },
//                           }));
//                         }}
//                         sx={{ flex: 1 }} SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200, 
//                            width: 150,
//                             }, }, }, }} >
        
//                         {times.map((time) => (
//                           <MenuItem key={time} value={time} 
//                           disabled={getDisabledTimes(availability[day].slots).has(time)}
//                           >
//                             {time}
//                           </MenuItem>
//                         ))}
//                       </TextField>
// {
//   /*
//   import React, { useState } from 'react';
// import { TextField, MenuItem, IconButton, Box, Typography, Button } from '@mui/material';
// import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
// import getDisabledTimes from './path/to/getDisabledTimes';
// import moment from 'moment';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers';

// const Dashboard = () => {
//   const [slots, setSlots] = useState([{ start: "09:00", end: "10:00" }]);
//   const [times, setTimes] = useState(["08:00", "09:00", "10:00", "11:00"]);
//   const [duration, setDuration] = useState(60); // Duration in minutes

//   const handleAddSlot = () => {
//     setSlots([...slots, { start: "09:00", end: "10:00" }]);
//   };

    
//                 <MenuItem key={time} value={time} disabled={getDisabledTimes(slots, times, duration).has(time)}>
//                   {time}
//                 </MenuItem>
             
           
//   */
// }
//                       <TextField
//                         select
//                         size="small"
//                         value={slot.end}                 
//                         onChange={(e) => {
//                           const updatedSlots = [...availability[day].slots];
//                           updatedSlots[index].end = e.target.value;
//                           setAvailability((prev) => ({
//                             ...prev,
//                             [day]: { ...prev[day], slots: updatedSlots },
//                           }));
//                         }}

//  sx={{ flex: 1 }} SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200, 
//                            width: 150,
//                             }, }, }, }}                      >
//                         {times.map((time) => (
//                           <MenuItem key={time} value={time}
//                           >
//                             {time}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                       <IconButton
//                         color="secondary"
//                         onClick={() => removeSlot(day, index)}
//                         disabled={availability[day].slots.length <= 1}
//                       >
//                         <AiOutlineMinusCircle color="secondary" />
//                       </IconButton>
//                       {index === availability[day].slots.length - 1 && (
//                         <IconButton
//                           color="primary"
//                           onClick={() => addSlot(day)}
//                         >
//                           <AiOutlinePlusCircle />
//                         </IconButton>
//                       )}
//                     </Box>
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           ))}
//         </Box>
//         {/* Calendar */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
//             Calendar
//           </Typography>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DateCalendar
//               value={selectedDate}
//               onChange={handleDateChange}
//               disablePast
//               minDate={new Date()} // Today is the minimum selectable date
//               maxDate={
//                 scheduleType === "weekly"
//                   ? moment().add(6, "days").toDate() // 7 days including today
//                   : moment().add(29, "days").toDate() // 30 days including today
//               }
//             />
//           </LocalizationProvider>
//         </Box>
//           {/* Modal */}
//       <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: "8px",
//           }}
//         >
//           <Typography variant="h6" component="h2">
//             Manage Slots for {selectedDate?.toDateString()}
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             {dateSlots.map((slot, index) => (
//               <Box
//                 key={index}
//                 sx={{ display: "flex", gap: "10px", alignItems: "center", mb: 1 }}
//               >
//                 <TextField
//                   select
//                   size="small"
//                   value={slot.start}
//                   onChange={(e) => handleDateSlotChange(index, "start", e.target.value)}
//                   sx={{ flex: 1 }}
//                 >
//                   {times.map((time) => (
//                     <MenuItem key={time} value={time}                       
//                     disabled={getDisabledTimes(dateSlots).has(time)}
//                     >
//                       {time}                      

//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <TextField
//                   size="small"
//                   value={slot.end}
//                   disabled // End time is automatically calculated
//                   sx={{ flex: 1 }}
//                 />
//                 <IconButton onClick={() => removeDateSlot(index)}>
//                   <AiOutlineMinusCircle />
//                 </IconButton>
//                 {index === dateSlots.length - 1 && (
//                   <IconButton onClick={addDateSlot}>
//                     <AiOutlinePlusCircle />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}
//           </Box>
//           <Box sx={{ textAlign: "right", mt: 3 }}>
//             <Button variant="contained" onClick={handleSaveDateSlots}>
//               Save Slots
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//       </Box>


// {/* Buttons */}
//       <Box sx={{ textAlign: "right", mt: 3 }}>
//         <Button variant="contained" sx={{ mr: 2 }} onClick={handleSendUpdatedData}>
//           Save Updated Data
//         </Button>
//         <Button variant="outlined" color="secondary">
//           Cancel
//         </Button>
//       </Box>

//       {/* Modal
//       <Modal open={isModalOpen} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: "8px",
//           }}
//         >    
//           <Typography variant="h6" component="h2">
//             Selected Date: {selectedDate.toDateString()}
//           </Typography>
//           <Typography sx={{ mt: 2 }}>
//             You clicked on {selectedDate.toDateString()}.
//           </Typography>
//           <Box sx={{ textAlign: "right", mt: 3 }}>
//             <Button variant="outlined" onClick={handleCloseModal}>
//               Close
//             </Button>
//           </Box>
//         </Box>
//       </Modal> */}
//     </Box>
//   );
// };

// export default Dashboard;