# daily-data-vis
Work for the Stanford Daily Data Vis Team.

Each sub-repo contains a seperate visualization.

## To contribute
Clone the repo to your computer, cd into it.
After making changes,
```
git add -A
git commit -m "Write sample commit message in imperative mood (ie not 'Wrote sample...')"
git push
```

## How to use:
Download repo, then 
```
cd ~/Downloads/daily/data-vis/specific-project
```
(or into wherever you've downloaded it).
Because it relies on requests for JSON files, you've got to launch a local server. Type into the terminal:
```
python -m SimpleHTTPServer 8000
```
then open your fave browser and find it served to the url
```
localhost:8000
```
You're flying!
