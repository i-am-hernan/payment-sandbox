import { Input } from "@/components/ui/input";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/button";
import React, { useRef, useEffect } from "react";

const Search = (props: any) => {
  const { onChange, properties, description, label, method, tab } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="border-b-2 z-10 sticky top-0 bg-background">
      <h4 className="text-[0.85rem] z-15 sticky top-0 text-adyen px-4 py-2">
        {`${label}`}
        <code className="px-1 text-xs text-grey">{method}</code>
      </h4>
      <p className="text-xs text-foreground px-4">{`${description}`}</p>
      <div className="flex pb-3 pt-2 px-4">
        <Input
          className="text-xs py-0 rounded-r-none text-foreground"
          ref={inputRef}
          type="search"
          placeholder="search"
          onChange={(e: any) => {
            let search = e.target.value;
            if (search) {
              const filtered = Object.keys(properties).filter((key) =>
                key.toLowerCase().includes(search.toLowerCase())
              );
              onChange(
                filtered.reduce((obj: any, key) => {
                  obj[key] = properties[key];
                  return obj;
                }, {})
              );
            } else {
              onChange(properties);
            }
          }}
        />
        <Button
          key="run"
          variant="default"
          size="icon"
          className="pt-0 rounded-l-none"
          spellCheck={false}
          onClick={(event) => {
            console.log("search button clicked");
          }}
        >
          <SearchIcon sx={{ fontSize: "12px" }} />
        </Button>
      </div>
    </div>
  );
};

export default Search;
