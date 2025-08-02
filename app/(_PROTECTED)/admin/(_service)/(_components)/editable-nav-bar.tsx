// @/app/(_PROTECTED)/admin/(_service)/(_components)/editable-nav-bar.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableWideMenu from "./editable-wide-menu";
import EditableMobileMenu from "./editable-mobile-menu";
import { menuData } from "@/app/config.ts/menu-data";
import type { MenuCategory } from "@/types/menu-types";
import { toast } from "sonner";

const HEADER_HEIGHT = 56;
const MOBILE_MENU_OFFSET = 40;

function fakeServerUpdate(data: MenuCategory[]): Promise<"ok"> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("ok"), 3000);
  });
}

function isCategoriesEqual(a: MenuCategory[], b: MenuCategory[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function EditableNavBar() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>(menuData.categories);
  const serverCategoriesRef = useRef<MenuCategory[]>(menuData.categories);
  const dirty = !isCategoriesEqual(categories, serverCategoriesRef.current);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const mobileMenuTopOffset = `${MOBILE_MENU_OFFSET}px`;
  const handleButtonClick = () => setIsOpen((v) => !v);
  const handleOverlayClick = () => setIsOpen(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fakeServerUpdate(categories);
      serverCategoriesRef.current = JSON.parse(JSON.stringify(categories));
      toast.success("All changes pushed to fake server");
    } catch {
      toast.error("Error updating on server");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="relative">
        <div
          className="flex items-center px-4 h-[56px]"
          style={{ minHeight: HEADER_HEIGHT, maxHeight: HEADER_HEIGHT }}
        >
          {isLargeScreen ? (
            <Button
              variant="destructive"
              onClick={handleButtonClick}
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap px-4"
            >
              <span>{isOpen ? "Close bar menu" : "Open bar menu"}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleButtonClick}
              className="flex items-center justify-center px-2"
              aria-label={isOpen ? "Close bar menu" : "Open bar menu"}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
        {isLargeScreen ? (
          <EditableWideMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            categories={categories}
            setCategories={setCategories}
            dirty={dirty}
            loading={loading}
            onUpdate={handleUpdate}
          />
        ) : (
          <EditableMobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            topOffset={mobileMenuTopOffset}
            categories={categories}
            setCategories={setCategories}
          />
        )}
      </div>
      {isOpen && (
        <div
          className={`
            fixed inset-0 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300 ease-in-out
            z-40
          `}
          style={{
            top: "64px",
          }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
    </>
  );
}
