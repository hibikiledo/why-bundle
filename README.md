# why-bundle

## Motivation

webpack-bundle-analyzer gives us useful information about what is in a bundle.  
Often, I find myself wonder why a module is bundled.  

Other tools are web based application which doesn't do well when stats file is large (300MB+).  
That's why I decided to solve this problem.

I hope you find it useful.

## Install

```
npm install -g why-bundle
```

## Usage

```
Usage: why-bundle [options]

Options:
  -V, --version                     output the version number
  -s, --stats <path_to_stats_file>  Specify stats file to read from
  -c, --chunk <chunk_name>          Name of the chunk (Support regular expression)
  -m, --module <module_name>        Name of module to see why it is bundled (Support regular expression)
  -h, --help                        output usage information
```

## Example

To find why module `user/selectors.js` is bundled in **main** chunk,
```
$ why-bundle -s ~/Desktop/stats.json -c main -m 'user/selectors.js'
```

## Contribution

This project is still under development. Issues and PRs are welcome.
