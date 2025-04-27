"use client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { addImage, removeAllImages } from "../data/crud";
import { EnchantedImage } from "../data/types";
import useStore from "@/components/image_enhancement/states/store";

export default function BottomRight() {
  const { images_enchanted_data, setTrigger, trigger } = useStore();

  async function OnAddImages() {
    const respone = await addImage(images_enchanted_data as EnchantedImage);
    console.log(respone);
    setTrigger(trigger);
  }

  async function OnRemoveAllImages() {
    const respone = await removeAllImages();
    console.log(respone);
    setTrigger(trigger);
  }

  return (
    <ButtonGroup variant="shadow" color="success" id="tour-action">
      <Button onClick={OnAddImages}>
        <div className="font-bold">Save</div>
      </Button>
      <Button variant="shadow" color="warning" onClick={OnRemoveAllImages}>
        <div className="font-bold">Clear</div>
      </Button>
    </ButtonGroup>
  );
}
