# Detect WordPress Core Modifications

This is a simple node command that checks a WordPress installation for modified and/or removed files. Modifying core
WordPress files is a quick way to introduce security vulnerabilities, break your site, and break future updates.

## Install via npm
1. Make sure you have node and npm installed.
1. Install the detect-wp-core-modifications npm package with the following shell command:

```
npm install -g detect-wp-core-modifications
```


## Usage

You can run the command without any arguments from within the root of a WordPress installation with the following shell
command:

```
detect-wp-core-modifications
```

You can also specify a relative or absolute path to a WordPress installation:

```
detect-wp-core-modifications ../wordpress
```