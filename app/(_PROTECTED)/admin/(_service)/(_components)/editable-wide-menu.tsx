// @/app/(_PROTECTED)/admin/(_service)/(_components)/editable-wide-menu.tsx

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuCategory, MenuLink } from "@/types/menu-types";
import { LinkActionsDropdown } from "./link-actions-dropdown";
import { CategoryActionsDropdown } from "./category-actions-dropdown";
import { useDialogs } from "@/app/contexts/dialogs-providers";

interface WideMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  dirty: boolean;
  loading: boolean;
  onUpdate: () => void;
}

const greenDotClass = "bg-emerald-500";

export default function EditableWideMenu({
  isOpen,
  setIsOpen,
  categories,
  setCategories,
  dirty,
  loading,
  onUpdate,
}: WideMenuProps) {
  const dialogs = useDialogs();
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string | null>(null);

  const activeCategory = activeCategoryTitle
    ? categories.find((cat) => cat.title === activeCategoryTitle)
    : null;

  const renderCategoryLinks = (links: MenuLink[]) => (
    <ul className="space-y-0 pr-1">
      {links.map((link, idx) => (
        <li
          key={link.name}
          className={cn(
            idx % 2 === 0 ? "bg-background" : "bg-muted",
            "group flex items-center px-2 h-10 relative"
          )}
        >
          <div className="flex-grow flex items-center gap-2 overflow-hidden">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {link.name}
            </span>
            {link.hasBadge && link.badgeName && (
              <Badge className="shadow-none rounded-full px-2.5 py-0.5 text-xs font-semibold h-6 flex items-center">
                <div className={cn("h-1.5 w-1.5 rounded-full mr-2", greenDotClass)} />
                {link.badgeName}
              </Badge>
            )}
          </div>
          <LinkActionsDropdown
            link={link}
            categoryTitle={activeCategoryTitle!}
            setCategories={setCategories}
          />
          <span
            className="flex items-center justify-center w-8 h-8 cursor-grab rounded hover:bg-accent/60 ml-1"
            tabIndex={-1}
          >
            <GripVertical className="w-4 h-4 text-primary/80" />
          </span>
          <div className="absolute left-0 bottom-0 w-full h-px bg-border opacity-50 pointer-events-none" />
        </li>
      ))}
    </ul>
  );

  const handleAddCategory = () => {
    dialogs.show({
      type: "create",
      title: "New category",
      description: "Enter a category name",
      value: "",
      confirmLabel: "Create",
      onConfirm: (value) => {
        if (!value) return;
        const maxOrder = categories.length
          ? Math.max(...categories.map((c) => c.order ?? 0))
          : 0;
        setCategories((prev) => [
          ...prev,
          {
            title: value,
            links: [],
            order: maxOrder + 1,
          },
        ]);
      },
    });
  };

  const handleAddLink = (category: MenuCategory) => {
    dialogs.show({
      type: "create",
      title: "New link",
      description: `Enter link name for "${category.title}"`,
      value: "",
      confirmLabel: "Create",
      onConfirm: (value) => {
        if (!value) return;
        setCategories((prev) =>
          prev.map((cat) =>
            cat.title === category.title
              ? {
                  ...cat,
                  links: [
                    ...cat.links,
                    {
                      name: value,
                      href: "#",
                      roles: [],
                      hasBadge: false,
                      order:
                        cat.links.length > 0
                          ? Math.max(...cat.links.map((l) => l.order ?? 0)) + 1
                          : 1,
                    },
                  ],
                }
              : cat
          )
        );
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 mx-auto bg-black text-white rounded-lg shadow-2xl overflow-hidden z-50"
      style={{ maxWidth: "80vw", top: "120px", height: "432px" }}
    >
      <div className="flex h-full">
        {/* Left panel: links */}
        <div className="flex-1 p-8 pb-12 flex flex-col custom-scrollbar">
          {activeCategory ? (
            <div className="relative flex-1 flex flex-col h-full min-h-0">
              <div
                className="sticky top-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-sm pb-2 mb-2"
                style={{ paddingBottom: 12, marginBottom: 8 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400 text-base font-semibold tracking-wider border-b border-gray-700 pb-1">
                    {activeCategory.title}
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2 border-green-500 border-2 rounded-full hover:bg-green-950/30 text-green-400 focus-visible:ring-green-400"
                    onClick={() => handleAddLink(activeCategory)}
                    title="Add link"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {renderCategoryLinks(activeCategory.links)}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 italic">
              Select a category to view its links
            </div>
          )}
        </div>
        {/* Right panel: categories, Add Category card, update button */}
        <div className="w-80 bg-gray-900 p-8 flex flex-col">
          <h3 className="text-gray-400 text-sm font-semibold mb-2 tracking-wider">
            CATEGORIES
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {categories.map((category) => (
              <div key={category.title} className="p-1">
                <Card
                  className={cn(
                    "bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer h-[60px]",
                    activeCategoryTitle === category.title
                      ? "ring-2 ring-white"
                      : ""
                  )}
                  onClick={() =>
                    setActiveCategoryTitle(
                      activeCategoryTitle === category.title ? null : category.title
                    )
                  }
                >
                  <CardContent className="flex items-center justify-between p-0 h-full">
                    <h4 className="text-white font-semibold text-base line-clamp-1 whitespace-nowrap overflow-hidden">
                      {category.title}
                    </h4>
                    <div className="flex items-center gap-1 ml-3">
                      <CategoryActionsDropdown
                        categoryTitle={category.title}
                        setCategories={setCategories}
                      />
                      <span
                        className="flex items-center justify-center w-8 h-8 cursor-grab rounded hover:bg-accent/60"
                        tabIndex={-1}
                      >
                        <GripVertical className="w-4 h-4 text-primary/80" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            <div className="p-1 mt-1">
              <Card
                className={cn(
                  "bg-black border-2 border-green-500 p-4 rounded-lg cursor-pointer flex items-center justify-center h-[60px] min-h-[60px] hover:bg-green-950/40 transition"
                )}
                onClick={handleAddCategory}
                tabIndex={0}
                style={{ borderStyle: "dashed" }}
              >
                <CardContent className="flex items-center justify-center p-0 h-full w-full">
                  <span className="text-green-400 font-semibold text-base">
                    Add category
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
          <Button
            type="button"
            className="w-full mt-4"
            onClick={onUpdate}
            variant={loading ? "default" : dirty ? "default" : "secondary"}
            disabled={!dirty || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : dirty ? (
              <>Update changes</>
            ) : (
              <>No changes</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
