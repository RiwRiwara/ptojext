import { DriveStep } from "driver.js";

export const tour_steps: DriveStep[] = [
  {
    element: "#tour-main",
    popover: {
      title: "Welcome to Image enhancement page tour",
      description:
        "This section can simulation image enhancement, But first let know about essential component of this page. Let's GOOO!!",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#tour-main",
    popover: {
      title: "This is just header",
      description: "You can back to main page.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-canvas",
    popover: {
      title: "Main Canvas",
      description: "This is main seciton you can explore it.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-original",
    popover: {
      title: "Original Image",
      description:
        "Starting image it always original",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#tour-feature",
    popover: {
      title: "Feature",
      description:
        "You can adjust or settting if you need.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '#tour-result',
    popover: {
      title: "Result Image",
      description:
        "Final result of image.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '#tour-action',
    popover: {
      title: "Action",
      description:
        "You can save current image and can clear.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '#tour-images',
    popover: {
      title: "All images",
      description:
        "Image that you save will appear in this.",
      side: "right",
      align: "start",
    },
  },
  {
    popover: {
      title: "Happy Explore",
      description:
        "And that is all, go ahead and start your imagine.",
    },
  },
];
