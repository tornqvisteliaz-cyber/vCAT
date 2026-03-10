# Product Requirements Document (PRD)

## Project Name
**RowsLink**

## Purpose
RowsLink is a Windows desktop application that connects cockpit hardware to flight simulators without complex setup. The product focuses on plug-and-play support for Rowsfire panels and other USB cockpit devices, with low latency, fast setup, and a clear user interface.

## Problem Statement
Current alternatives create friction for users:

### MobiFlight pain points
- Outdated interface
- Long setup process
- Large, messy configuration files
- No built-in auto-mapping

### SPAD.next pain points
- Expensive
- Hard for new users
- Feature-heavy and can feel too complex

### Current user impact
Users often spend **1 to 3 hours** configuring cockpit hardware.

## Product Goal
A user plugs in a panel, launches RowsLink, and the panel works within **5 seconds**.

## Target Users
- Flight simulator hobbyists
- Home cockpit builders
- Rowsfire panel users
- Microsoft Flight Simulator 2020 and 2024 users

## Core Features

### 1) Hardware Detection
RowsLink automatically identifies connected cockpit panels.

**Requirements**
- Detect USB HID devices
- Read Vendor ID (VID) and Product ID (PID)
- Recognize Rowsfire products
- Show discovered panels in the UI

### 2) Simulator Connection
RowsLink connects hardware mappings to supported simulators.

**Simulator support**
- Microsoft Flight Simulator via **SimConnect**
- X-Plane via **DataRefs**
- FSUIPC via **FSUIPC7 offsets**

### 3) Mapping Engine
Maps physical hardware inputs to simulator events and values.

**Supported inputs**
- Push buttons
- Toggle switches
- Rotary encoders
- Potentiometers

**Supported outputs**
- LED indicators
- LCD displays
- Backlight control

## Profiles

### Aircraft Profiles
Each aircraft has one or more profiles.

**Functions**
- Auto-load profile when an aircraft starts
- Support multiple profiles per aircraft
- Export and import profiles

## Auto-Mapping
RowsLink suggests mappings between panel controls and aircraft events.

### Example: A320 autopilot panel
- **Button:** AP1 → `AUTOPILOT_MASTER`
- **Encoder (Heading):**
  - Clockwise → `HEADING_BUG_INC`
  - Counter-clockwise → `HEADING_BUG_DEC`

## User Interface

### Dashboard
Shows:
- Connected panels
- Simulator connection status
- Active aircraft profile

### Device Panel Page
Shows each physical panel with:
- Buttons
- Encoders
- LED outputs

### Mapping Editor
User clicks a control and selects a simulator event.

## Performance Requirements
- Input latency: **max 20 ms**
- Device polling: **10 ms**
- App startup: **under 3 seconds**

## Compatibility

### Operating Systems
- Windows 10
- Windows 11

### Simulators
- Microsoft Flight Simulator
- Microsoft Flight Simulator 2024
- X-Plane 11
- X-Plane 12

## Technical Architecture

### Backend
- C#
- .NET

### Simulator Integration
- SimConnect SDK
- FSUIPC7 API/offset access

### USB Communication
- HIDSharp

## Plugin System
Plugins add support for new panels, aircraft, and advanced integrations.

### Example plugin: Fenix A320
Adds:
- Custom variables
- Special autopilot events

## Security and Access Modes

### Standard mode
- Mapping
- Profile selection

### Admin mode
- Device configuration
- Plugin installation

## Future Features
- Cloud Profiles: sync profiles between PCs
- Community Library: user-shared aircraft profiles
- Auto Updates: automatic plugin updates

## Success Metrics
- Setup time target: **under 5 minutes**
- Stability target: **crash rate under 0.1%**
- Adoption target: **1,000 active users in year one**

## MVP Scope

### Version 1
- USB device detection
- MSFS SimConnect connection
- Button mapping
- Encoder support
- Aircraft profiles
- Basic UI

### Version 2
- LED outputs
- Auto aircraft detection
- Plugin system
- Cloud profiles

## Vision
RowsLink should become the standard cockpit hardware tool for flight simulators by delivering faster setup, stable connectivity, and a better user experience than current alternatives.
