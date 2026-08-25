$git = "C:\Users\koran\Downloads\mingit\cmd\git.exe"

Write-Host "Configuring Git identity..."
& $git config user.name "myprojectsKORANAGAMASTANSAI"
& $git config user.email "koranagamastansai@users.noreply.github.com"

Write-Host "Adding files to Git..."
& $git add .

Write-Host "Committing project files..."
& $git commit -m "first commit: full CODE BRAINS project with 50 CV projects, database, and new pricing"

Write-Host "Setting main branch..."
& $git branch -M main

Write-Host "Setting remote origin..."
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/myprojectsKORANAGAMASTANSAI/CODEBRAINS.git

Write-Host "Pushing to GitHub..."
& $git push -u origin main
