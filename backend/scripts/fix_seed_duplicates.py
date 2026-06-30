"""Remove duplicate sections from seed_data.py."""
import re

path = "scripts/seed_data.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the SECOND occurrence of "# ── 20. Customers" which starts the duplicate block
first_customers = content.find("# ── 20. Customers")
second_customers = content.find("# ── 20. Customers", first_customers + 50)

if second_customers > 0 and second_customers > first_customers:
    # Find the end of the SECOND customer section that leads into the real summary
    # The duplicate block runs from second_customers to the "# ── Summary" section
    # But we need the FIRST summary, not one in the duplicate block
    
    # Find all occurrences of "SEED COMPLETE!"
    seed_complete_positions = [m.start() for m in re.finditer("SEED COMPLETE!", content)]
    
    if len(seed_complete_positions) >= 2:
        # The content we want to keep is everything up to the FIRST "SEED COMPLETE!"
        # plus the summary after that point
        first_seed_complete = seed_complete_positions[0]
        second_seed_complete = seed_complete_positions[1] if len(seed_complete_positions) > 1 else len(content)
        
        # Keep everything up to and including the first SEED COMPLETE! section
        # Find the end of the first summary - it's after "await engine.dispose()"
        first_summary_end = content.find("async def seed():", first_seed_complete)
        if first_summary_end == -1:
            first_summary_end = len(content)
        
        # The duplicate starts at second_customers
        # Keep content from start to second_customers
        cleaned = content[:second_customers]
        
        # Remove any partial content after the first seed complete
        # Find the end marker
        end_marker = "if __name__ == \"__main__\":"
        first_end = content.find(end_marker, first_seed_complete)
        
        if first_end > 0:
            # Keep everything from start to the end marker in the first occurrence
            # But we need the __main__ block
            # Find the first occurrence of the if __name__ block
            first_name_main = content.find('if __name__ == "__main__":')
            if first_name_main > 0 and first_name_main > second_customers:
                # Remove from second_customers to first_name_main, but keep the if __name__ block
                cleaned = content[:second_customers] + content[first_name_main:]
                print(f"  Removed duplicate from position {second_customers} to {first_name_main}")
            else:
                print(f"  Could not find proper boundary, using simple truncation at {second_customers}")
                # Fallback: keep everything before the duplicate block
                cleaned = content[:second_customers]
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(cleaned)
        print(f"  Fixed seed_data.py - removed duplicate sections")
        print(f"  Original size: {len(content)} chars")
        print(f"  New size: {len(cleaned)} chars")
    else:
        print(f"  Could not find SEED COMPLETE markers. Found {len(seed_complete_positions)}")
else:
    print("  No duplicate found - seed_data.py is clean")
