import { toast, cssTransition } from "react-toastify";
import Swal from "sweetalert2";
import "animate.css";
import 'react-toastify/dist/ReactToastify.css'
const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});


export const displayLog = (code, message) => {
  if (code ===0) {
    toast.error(message, {
      progress: undefined,
      transition: bounce,
    });
  } else if (code === 1) {
    toast.success(message, {
      progress: undefined,
      transition: bounce,
    });
  } else if (code ===2) {
    toast.info(message, {
      progress: undefined,
      transition: bounce,
    });
  } else {
    toast.warning(message, {
      progress: undefined,
      transition: bounce,
    });
  }
};


export const capitalizeFirstLetter = (text) => {
  text = text.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1).trim();
};
export function capitalizeEveryFirstLetter(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
export function lowerCaseEveryLetterExceptFirst(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0) + word.substring(1).toLowerCase();
    })
    .join(" ");
}


export const tConvert = (time) => {
  time = time
    ?.toString()
    ?.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};

tConvert("18:00:00");

export const confirmBoxRefreshToken = (title, message) => {
  return new Promise((resolve, reject) => {
    let obj = {
      // title: message,
      text: message,
      showCancelButton: false,
      cancelButtonText: "Cancel",
      confirmButtonText: `Ok`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    };

    if (title) obj.title = title;
    Swal.fire(obj).then((result) => {
      if (result.isConfirmed) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

export const confirmBox = (title, message) => {
  return new Promise((resolve, reject) => {
    let obj = {
      // title: title ? title: null,
      text: title !== undefined ? message.concat(" ", title, " ?") : message,
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: `Yes`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    };

    // if (title) {obj.title = title};
    Swal.fire(obj).then((result) => {
      if (result.isConfirmed) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const isValidEmail = (email) => {
  const emailRegex =/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export function capitalizeOnlyFirstLetter(string) {
  if (typeof string !== "string" || string.length === 0) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const LowerCaseLetters = (text) => {
  text = text.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1).trim();
};
