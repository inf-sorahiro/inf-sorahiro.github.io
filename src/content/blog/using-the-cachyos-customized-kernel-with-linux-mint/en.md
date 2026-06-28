---
title: 'How to Replace the Kernel on Linux Mint 22.3 with a CachyOS Custom‑Compiled Kernel'
description: 'Sharing the experience of replacing the kernel with a custom‑compiled, optimised one on Mint while retaining NVIDIA GPU drivers'
date: 2026-06-28
tags: [Linux]
category: 'Tutorial'
cover: https://raw.githubusercontent.com/LingXi9374/LingXi9374.github.io/master/src/content/posts/images/using-the-cachyos-customized-kernel-with-linux-mint.png
lang: en
draft: false
---

## Introduction

Continuing from my previous post, after adding a hard drive to my new gaming laptop (Acer Predator Helios Neo 7 / Shadow Knight Qing 7), I immediately installed Linux Mint. I chose this distribution because it is beginner‑friendly, works out of the box, and is stable enough for a production environment. However, since its upstream is Ubuntu 24.04 LTS, the kernel stays at 6.17+. With the 7.x kernel having been available for over two months and having fixed a large number of privilege escalation vulnerabilities, the default 6.17 kernel now feels a bit outdated.

So I started thinking about upgrading to the 7.x kernel. You might wonder: if I want to play with such things, why not just use Fedora, Arch, or similar distros? Why stick with a Debian/Ubuntu‑based one? Actually, my original plan was to install CachyOS directly so I could enjoy its custom‑tuned kernel. But coincidentally, the AUR repository malware attack was still ongoing at that time (it has since ended and been cleaned up). Given the high risk, I backed off. I would rather do something geeky on a seemingly non‑geeky distribution than constantly face unknown risks on an Arch‑based system.

Replacing the kernel on a distribution with a custom‑compiled one is not just an experiment; it is a worthwhile deep dive. I once tried replacing the kernel on Ubuntu with a Zen kernel, but it failed – NVIDIA DKMS kept showing compilation errors ~~(fxxk nvidia)~~, preventing the NVIDIA driver from working. Later, I searched for related articles online and found that most tutorials only explain how to replace the kernel, but not what to do after, such as adding drivers. Even worse, those kernels were often pre‑compiled official Debian/Ubuntu packages, completely unrelated to custom compiling. After some thought, I decided: since no one seems to have tried this, I'll be the first!

Linux Mint, compared to Ubuntu, removes many unnecessary services and packages left by Canonical (such as Snap). This makes it a cleaner and more practical environment for this experiment, and likely more open to user customisation. Without further ado, let's dive in!

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/i-created-wallpaper-for-linux-mint-v0-rmhmplodt54f1.5trp701y67.png)

## Why I Chose the CachyOS Kernel

It is well known that the CachyOS kernel brings many performance and security optimisations. But what exactly are they?

The CachyOS kernel provides excellent system performance and flexibility through various schedulers and advanced optimisation techniques.

### Kernel Features

The CachyOS kernel supports multiple schedulers, including **BORE** (Burst‑Oriented Response Enhancer), **EEVDF** (Earliest Eligible Virtual Deadline First), and **BMQ** (Bitmap Queue scheduler). These schedulers optimise system performance for different use cases, allowing users to choose the most suitable one.

The kernel also supports **x86-64-v3** and **x86-64-v4** instruction set optimisations, tailored for modern CPU architectures. Furthermore, the CachyOS kernel improves performance through the **Clang compiler** and **LTO (Link Time Optimisation)**.

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/cachyos-kavratech.5c1nifr23t.jpg)

### Performance Optimisations

The CachyOS kernel includes the following performance enhancements:

 - **AMD P‑State** support: optimises power consumption and performance for AMD processors.

 - **ZFS filesystem support**: provides more efficient storage management.

 - **Memory management improvements**: including prevention of page thrashing under memory pressure.

 - **I/O scheduler optimisation**: supports **bfq** and **mq-deadline** schedulers.

### Real‑world Results

According to tests, replacing the default Arch kernel with the CachyOS kernel results in about a **6%** improvement in both single‑threaded and multi‑threaded performance. This software‑driven performance boost is especially noticeable on modern hardware.

### Use Cases

The CachyOS kernel is suitable for advanced Arch Linux users who want to boost system performance, while also providing easy‑to‑use optimisation tools for newcomers. Its flexible schedulers and hardware support make it ideal for desktops, servers, and development environments.

Through its advanced optimisation techniques and flexible configuration options, the CachyOS kernel delivers an efficient and secure Linux experience.

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/wallpaperflare.com_wallpaper.8z775yqwuc.jpg)

## Preparing the Environment

<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm">
        ⚠️ CAUTION:

        It is entirely possible to compile the CachyOS kernel on a non‑Arch‑based distribution, but one key point must be clear: CachyOS's patches, configuration files, and build scripts (PKGBUILD) are specifically optimised and tested for Arch Linux's software ecosystem (e.g., specific versions of GCC/Clang, mkinitcpio, systemd). Manually compiling on other distributions may lead to missing dependencies, compilation errors, incompatible kernel modules, or failure to boot. This operation is not officially supported by CachyOS.

        Additionally, custom kernel compilation often requires **a certain understanding of Linux**, and some steps involve **sensitive operations** – a single wrong step can force you to **restore and start over**! Remember to back up the official kernel image (the 'old' kernel relative to the new one).
</div>

The core idea behind compiling the CachyOS kernel for Mint is to extract the core logic from the PKGBUILD script and translate it into a generic compilation workflow that we can understand.

I used the CachyOS kernel source version `7.1.1-2` with the default BORE scheduler. Please note that some steps may differ for other versions. The source and patch repositories are linked below:

[CachyOS Kernel Source Repository](https://github.com/CachyOS/linux)

[CachyOS Kernel Patches Repository](https://github.com/CachyOS/kernel-patches)

### Installing Build Dependencies

Compiling the CachyOS kernel requires the standard Linux kernel build toolchain and the Rust compiler (for Rust code within the kernel). Since I'm using Mint, I'll use the generic commands for **Debian/Ubuntu series**:

```bash
sudo apt update
sudo apt install build-essential bc bison flex libssl-dev libelf-dev libncurses-dev zlib1g-dev cpio wget tar xz-utils zstd python3 perl rustc cargo librust-bindgen-dev pahole dwarves
```

### Downloading Source, Patches, and Configuration

Based on the PKGBUILD variables, the current version is `7.1.1-2`.

```bash
# 1. Create a dedicated folder for source and patches for easy management (under $HOME)
mkdir kernel-build && cd kernel-build/

# 2. Download and extract the kernel source
wget https://github.com/CachyOS/linux/releases/download/cachyos-7.1.1-2/cachyos-7.1.1-2.tar.gz
tar -xf cachyos-7.1.1-2.tar.gz
cd cachyos-7.1.1-2

# 3. Download the default CachyOS configuration
wget https://raw.githubusercontent.com/CachyOS/linux-cachyos/master/config -O .config

# 4. Download and apply the default scheduler patch (BORE)
wget https://raw.githubusercontent.com/cachyos/kernel-patches/master/7.1/sched/0001-bore-cachy.patch
patch -Np1 < 0001-bore-cachy.patch

# 5. Download and apply the CJKTTY patch (to display Chinese/CJK characters in tty)
wget https://raw.githubusercontent.com/bigshans/cjktty-patches/master/v7.x/cjktty-7.1.patch
patch -Np1 < cjktty-7.1.patch
```
*Note: If you need to apply other patches (e.g., RT real‑time patches, ZFS support), download them from `https://github.com/cachyos/kernel-patches` and apply with `patch -Np1 < {patch_file}`.*

## Adjusting Kernel Configuration

Before making adjustments, let's **adapt the old configuration to the current kernel source tree**.

```bash
make olddefconfig
```
Since `make menuconfig` has higher priority than the `scripts/config` script and will overwrite modifications saved by the script, it's better to first fine‑tune the desired options with `menuconfig` and then use the script to modify the kernel configuration.

### Preemption (Game Optimisation)

```plaintext
General setup  --->
    Preemption Model  --->
        (X) Preemptible Kernel (Low-Latency Desktop)
```

### Tick Rate

```plaintext
General setup  --->
    Timer frequency  --->
        (X) 1000 HZ    # Recommended for gaming
```

### Memory / Performance Related

```plaintext
Processor type and features  --->
    Transparent Hugepage support  --->
        (X) Always
    [*] Memory compaction
    [*] Page migration
    # Noticeable improvement in game performance
```

### Network Optimisation (Gaming)

```plaintext
Networking support  --->
    Networking options  --->
        [*] TCP: advanced congestion control  --->
            (X) BBR v3    # If available in 7.0 menuconfig
        [*] Network packet filtering framework (Netfilter)
```

### File Systems

This varies per person. I use XFS as my root filesystem, so I enable XFS support:

```plaintext
File systems  --->
    <*> XFS filesystem support
    [*]   XFS Quota support
    [*]   XFS POSIX ACL support
    [*]   XFS Realtime subvolume support
    [*]   XFS online repair support    # New in 7.0
```

The PKGBUILD uses the `scripts/config` script to make many changes to the default configuration. After configuring with `menuconfig`, we need to apply these core CachyOS optimisations to `.config` using the script.

```bash
# Disable kernel debugging, otherwise the image may be too large to boot
scripts/config -d CONFIG_DEBUG_INFO
scripts/config -d CONFIG_DEBUG_KERNEL

# Enable BORE scheduler
scripts/config -e SCHED_BORE

# Enable O3 compilation optimisation (PKGBUILD: _cc_harder=yes)
scripts/config -d CC_OPTIMIZE_FOR_PERFORMANCE -e CC_OPTIMIZE_FOR_PERFORMANCE_O3

# Set Tick Rate to 1000Hz (PKGBUILD: _HZ_ticks=1000)
scripts/config -d HZ_300 -e HZ_1000 --set-val HZ 1000

# Set Transparent Hugepages to always (PKGBUILD: _hugepage=always)
scripts/config -d TRANSPARENT_HUGEPAGE_MADVISE -e TRANSPARENT_HUGEPAGE_ALWAYS

# Set preemption to full (PKGBUILD: _preempt=full)
scripts/config -e PREEMPT -d PREEMPT_LAZY

# Enable x86_64-v3 microarchitecture
scripts/config -d GENERIC_CPU
scripts/config -d GENERIC_CPU2
scripts/config -e GENERIC_CPU3
scripts/config -d GENERIC_CPU4
scripts/config -d NATIVE
```

If you need to enable TCP BBR3 or change the CPU architecture optimisation (e.g., Zen4), you can add additional `scripts/config` commands for fine‑tuning.

Now, let's verify that all the modifications have been applied:

```bash
# Verify all modifications
echo "=== Disable DEBUG ==="
grep CONFIG_DEBUG_INFO
grep CONFIG_DEBUG_KERNEL
echo "=== CPU Architecture ==="
grep CONFIG_GENERIC_CPU .config
echo "=== BORE ==="
grep CONFIG_SCHED_BORE .config
echo "=== O3 ==="
grep CC_OPTIMIZE_FOR_PERFORMANCE .config
echo "=== HZ ==="
grep CONFIG_HZ .config
echo "=== THP ==="
grep TRANSPARENT_HUGEPAGE .config
echo "=== Preempt ==="
grep CONFIG_PREEMPT .config
```

If the verification results match your expectations (enabled shows `=y`, disabled shows `is not set`), it's time to actually build your custom‑configured kernel!

## Compiling the Kernel and Installing

Unlike `make install` on other distributions, Debian/Ubuntu series use deb packages to install kernels and manage them with dpkg. We can use the modern kernel's built‑in deb packaging target, while also using all CPU cores for compilation:

```bash
# Build kernel deb packages
make -j$(nproc) bindeb-pkg LOCALVERSION=-cachyos-bore-lto-{your_custom_suffix_here} KDEB_PKGVERSION=3

# Build kernel modules
make -j$(nproc) modules
```

Wait for the compilation to finish and generate the image; it will be automatically packaged into deb packages for installation, which are also easy to remove later. The deb packages will appear in the parent directory. After compilation, proceed with installation:

```bash
cd ~/kernel-build
sudo dpkg -i linux-headers-7.1.1-cachyos-bore-lto-{your_custom_suffix}_3_amd64.deb
sudo dpkg -i linux-image-7.1.1-cachyos-bore-lto-{your_custom_suffix}_3_amd64.deb
```

After installation, go to the kernel source directory and install the kernel modules:

```bash
cd cachyos-7.1.1-2
sudo make modules_install
```

## 【Important】NVIDIA DKMS Module

### Installing the NVIDIA Open‑Source Kernel Module for the New Kernel

<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm">
        ⚠️ NOTICE:
        
        The NVIDIA DKMS open‑source driver provided by Ubuntu includes the `open` suffix, but the modules it provides are actually closed‑source (`/lib/modules/{kernel_version}/updates/dkms/nvidia.ko.zst`; the open‑source module is at `/lib/modules/{kernel_version}/kernel/drivers/video/nvidia.ko`). The closed‑source module is incompatible with a custom‑compiled kernel, so you must disable it or uninstall the related driver packages.
</div>

Every NVIDIA GPU has a corresponding driver version. For example, my gaming laptop with RTX 5060 Laptop shows driver version `595.71.05` after installing Linux Mint. Unless necessary, try to keep the same driver version during the process!

Stay in the `~/kernel-build` directory, download the DKMS open‑source module source package, extract, build, and install:

```bash
cd ~/kernel-build

# Replace the version number with your driver version; using 595.71 as an example
wget https://github.com/NVIDIA/open-gpu-kernel-modules/archive/refs/tags/595.71.05.tar.gz

# Extract and enter the module source directory
tar -xf 595.71.05.tar.gz
cd open-gpu-kernel-modules-595.71.05

# Compile and install
make -j$(nproc) modules IGNORE_CC_MISMATCH=yes SYSSRC=/lib/modules/$(uname -r)/build
sudo make modules_install IGNORE_CC_MISMATCH=yes SYSSRC=/lib/modules/$(uname -r)/build
```

### Cleaning Up the Closed‑Source Driver Module Provided by Ubuntu

After installing the module, don't rush to update the bootloader and reboot. Let's first remove the interfering closed‑source module from Ubuntu:

```bash
# 1. Check which module is currently loaded
modinfo nvidia | grep filename

# 2. Delete the previously DKMS‑compiled closed‑source module (deprecated)
sudo rm -f /lib/modules/$(uname -r)/updates/dkms/nvidia*.ko*

# 3. Remove the closed‑source module record for the 7.1 kernel from DKMS (keep the ones for 6.14 and 6.17)
sudo dkms remove nvidia/595.71.05 -k 7.1.1-cachyos-bore-lto-{your_custom_suffix}

# 4. Update module dependencies
sudo depmod -a

# 5. Verify DKMS status (should only show entries for the old kernels)
sudo dkms status
```

## Updating Initramfs and Bootloader (Critical)

`make install` does not usually automatically generate initramfs or update the GRUB boot menu outside of Arch Linux. You must manually perform the following steps according to your distribution (still using Debian/Ubuntu series as an example):

```bash
# Get the newly installed kernel version
KERNEL_VER=$(cat include/config/kernel.release)
sudo update-initramfs -c -k $KERNEL_VER
```

Next, edit the GRUB bootloader configuration:

```bash title="/etc/default/grub"
# Find GRUB_CMDLINE_LINUX_DEFAULT and add the following parameters:

GRUB_CMDLINE_LINUX_DEFAULT="... nvidia-drm.modeset=1 nowatchdog mitigations=off threadirqs loglevel=5..."

# Remove quiet splash     - Disables suppression of kernel output during boot and disables the splash screen (usually a brand/distro logo)
# nvidia-drm.modeset=1    - Enables NVIDIA Wayland/DRM support
# nowatchdog              - Disables watchdog, reduces latency
# mitigations=off         - Disables Spectre/Meltdown mitigations (performance gain, slight security decrease)
# threadirqs              - Thread IRQ handlers
# loglevel=5              - Sets kernel boot log level to 5
```

Apply the GRUB configuration:

```bash
sudo update-grub
sudo reboot
```

## Verification

Open a terminal and run the following commands:

```bash
# Confirm you are booting the CachyOS kernel
uname -r
# Expected output similar to: 7.1.1-cachyos-bore-lto-{your_custom_suffix}

# Confirm that the NVIDIA GPU is properly driven
nvidia-smi
# If no error appears, the driver installation was successful

# Confirm the BORE scheduler
dmesg | grep -i bore

# Confirm LTO optimisation
cat /proc/version
# Should include the LOCALVERSION you set

# Confirm that the build options match your earlier actions
echo "=== CPU Architecture ==="
grep CONFIG_GENERIC_CPU /boot/config-$(uname -r)
echo "=== BORE ==="
grep CONFIG_SCHED_BORE /boot/config-$(uname -r)
echo "=== O3 ==="
grep CC_OPTIMIZE_FOR_PERFORMANCE /boot/config-$(uname -r)
echo "=== HZ ==="
grep CONFIG_HZ /boot/config-$(uname -r)
echo "=== THP ==="
grep TRANSPARENT_HUGEPAGE /boot/config-$(uname -r)
echo "=== Preempt ==="
grep CONFIG_PREEMPT /boot/config-$(uname -r)
```

Check if the NVIDIA open‑source driver module is being used:

```bash
# Most accurate way: check the module file path and metadata
modinfo nvidia | grep -E "filename|version|description|author|license"

# View the actual location of the module (determine its source)
find /lib/modules/$(uname -r) -name "nvidia.ko*" -exec ls -la {} \;

# Directly check strings inside the module (open‑source modules contain specific identifiers)
strings $(modinfo nvidia | grep filename | awk '{print $2}') | grep -i "open.*gpu\|nvidia.*open\|GPL" | head -5
```

Criteria for identifying open driver:

| Feature | Closed‑Source Module (DKMS) | Open‑Source Module (manually compiled from GitHub) |
| ------- | --------------------------- | -------------------------------------------------- |
| **Path** | `/lib/modules/.../updates/dkms/nvidia.ko.zst` | `/lib/modules/.../kernel/drivers/video/nvidia.ko` |
| **license** | `NVIDIA` | `GPL` or `Dual MIT/GPL` |
| **description** | `NVIDIA Linux Kernel Module` | `NVIDIA open gpu kernel module` |
| **strings content** | No `open-gpu` string | Contains `open-gpu-kernel-modules` |

If you are unsure whether the expected results match, refer to my output:

```bash
lingxi@lingxi-Shadow-SH16-74:~$ uname -r
7.1.1-cachyos-bore-lto-lingxi9374
lingxi@lingxi-Shadow-SH16-74:~$ dmesg | grep -i bore
[    0.000000] Linux version 7.1.1-cachyos-bore-lto-lingxi9374 (lingxi@lingxi-Shadow-SH16-74) (gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #3 SMP PREEMPT_DYNAMIC Tue Jun 23 01:19:49 CST 2026
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-7.1.1-cachyos-bore-lto-lingxi9374 root=UUID=3239xxxx-xxxx-xxxx-xxxx-xxxxxxxx2dab ro nvidia-drm.modeset=1 nowatchdog mitigations=off threadirqs loglevel=5
[    0.030901] Kernel command line: BOOT_IMAGE=/boot/vmlinuz-7.1.1-cachyos-bore-lto-lingxi9374 root=UUID=3239xxxx-xxxx-xxxx-xxxx-xxxxxxxx2dab ro nvidia-drm.modeset=1 nowatchdog mitigations=off threadirqs loglevel=5
[    0.064552] BORE CPU Scheduler modification 6.6.3 by Masahito Suzuki
[    0.923421] usb usb1: Manufacturer: Linux 7.1.1-cachyos-bore-lto-lingxi9374 xhci-hcd
[    0.926580] usb usb2: Manufacturer: Linux 7.1.1-cachyos-bore-lto-lingxi9374 xhci-hcd
lingxi@lingxi-Shadow-SH16-74:~$ cat /proc/version
Linux version 7.1.1-cachyos-bore-lto-lingxi9374 (lingxi@lingxi-Shadow-SH16-74) (gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #3 SMP PREEMPT_DYNAMIC Tue Jun 23 01:19:49 CST 2026
```

## Maintenance Notes

Using a custom‑compiled kernel means higher maintenance costs. Unlike the automatic configuration of official kernels, all future updates and maintenance require your decisions. Here is a cheat sheet for your reference:

| Scenario | What You Need to Do |
| -------- | ------------------- |
| **Minor 7.1 kernel update** (e.g., recompiling 7.1.2 yourself) | Download the open-gpu-kernel-modules source from GitHub again, re-run `make modules && make modules_install` |
| **NVIDIA releases a driver update like 595.72** | Ubuntu packages will automatically update userspace libraries, but **kernel modules need to be manually recompiled** |
| **Rollback to 6.14/6.17 kernel** | Nothing to do; the DKMS closed‑source module will work automatically |
| **System apt upgrade updates nvidia-dkms-595-open** | Check if `/lib/modules/7.1.1.../updates/dkms/` has been re‑populated with closed‑source modules; if so, delete them |

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/avantages-de-linux-mint-sur-windows-11-1536x864.99u0z3wrdl.png)

## Additional Suggestions

After replacing the kernel, you can install `gamemode` to complement the CachyOS kernel's BORE scheduler:

```bash
sudo apt install gamemode
# Add to Steam launch options: gamemoderun %command%
```

Also, enable CPU performance mode:

```bash
sudo apt install linux-cpupower
sudo cpupower frequency-set -g performance
# Or adjust via CPU Power GUI
```

## Conclusion

If everything went well, congratulations! You have successfully followed me to build and use a custom‑compiled kernel on Linux Mint while retaining the NVIDIA GPU driver! Your **Linux Mint 22.3 + Linux CachyOS BORE 7.1 Kernel + NVIDIA Open modules** combination is now fully operational. You should be able to feel the improvement in game frame time stability brought by the BORE scheduler. Enjoy! 🎮

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/Screenshot_20260625_231305.77e86zjgbw.png)
