# node-red-contrib-sanitizer

Technical portion of the interview for HPC Student Web Developer

## Goal

The goal of this technical excercise is to create a new node in the [NodeRED](http://nodered.org/) framework from the specifications given below. Focus should be placed on correctness, documentation, and code clarity.

## Instructions

1. Fork this repository.
2. Install NodeRED
3. Develop the specified node, starting with the templates provided in this repository.
4. Add the node to NodeRED.
5. Submit a pull request with your changes.

## Node Design Specifications

* The sanitizer node should take a JSON object in **msg.payload**, sanitize it based on a user-defined configuration, and then send the sanitized object on **msg.payload**.
* The sanitizer node's edit template (defined in sanitizer.html) should allow the user to specify an object configuration. This configuration will define how the object passed on **msg.payload** is sanitized. The built-in [switch node](https://github.com/node-red/node-red/blob/master/nodes/core/logic/10-switch.html) should provide a good starting point for building the sanitizer node's edit template.
* This [Stackoverflow answer](http://stackoverflow.com/a/25983468) should offer a good starting for what to look for when sanitizing a JSON object.
