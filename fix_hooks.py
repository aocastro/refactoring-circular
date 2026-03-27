import os
import glob

# Files starting from the workspace root
base_dir = '/Users/adrianooliveiracastro/Documents/Projects Web/refactoring-circular'
directories = ['src/components/admin', 'src/components/dashboard', 'src/components/store', 'src/pages']

target_str = '  if (loadingData) return <div className="flex h-40 items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;'

for d in directories:
    dir_path = os.path.join(base_dir, d)
    for root, _, files in os.walk(dir_path):
        for file in files:
            if not file.endswith('.tsx'): continue
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r') as f:
                content = f.read()
            
            if target_str in content:
                # Remove the early loading return
                content = content.replace(target_str + '\n', '')
                content = content.replace(target_str, '')

                # Find the main return. Let's look for `  return (` which is typically the JSX return.
                # Since there might be other returns (e.g. in map functions), we look for the last one
                # or the one that is indented with 2 spaces. 
                # A safer rfind is `\n  return (`
                last_return_idx = content.rfind('\n  return (')
                if last_return_idx == -1:
                    last_return_idx = content.rfind('\n  return(')
                
                if last_return_idx != -1:
                    new_content = content[:last_return_idx] + '\n' + target_str + '\n' + content[last_return_idx:]
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Fixed hooks in {filepath}")
                else:
                    print(f"Could not find return in {filepath}")
