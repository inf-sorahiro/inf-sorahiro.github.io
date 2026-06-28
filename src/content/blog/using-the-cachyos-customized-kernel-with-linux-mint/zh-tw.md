---
title: 如何給 Linux Mint 22.3 換上 CachyOS 的用戶自編譯核心
description: '分享在 Mint 上更換自編譯帶最佳化的核心且保留 N 卡驅動的經驗'
date: 2026-06-28
tags: [Linux]
category: 教學
cover: https://raw.githubusercontent.com/LingXi9374/LingXi9374.github.io/master/src/content/posts/images/using-the-cachyos-customized-kernel-with-linux-mint.png
lang: zh-tw
draft: false
---

## 前言

書接上回，我給新遊戲本（宏碁暗影騎士擎7）加了硬碟之後立馬將 Linux Mint 安裝上去了，我選擇該發行版的原因一是對新手友好開箱即用，二是穩定可作為生產環境。但是由於它上游是 Ubuntu 24.04 LTS，核心停留在了 6.17+，在 7.x 核心開啟兩個多月後且修復大批提權漏洞的當下看起來有點過時了。

於是我有了想升級到 7.x 核心的心思。你肯定疑惑：想這麼玩為什麼不上 Fedora, Arch 這類發行版呢？而非要選擇 Debian/Ubuntu 系發行版？其實我本來的打算是裝 CachyOS 可直接享受它的特調核心的，但碰巧 AUR 倉庫木馬攻擊事件在當時還未停止（現在已經結束且清理解決了），看在風險這麼高的份上我望而卻步了。我寧可在看似不 Geek 的發行版上做點 Geek 的事情，也不想在 Arch 系上承擔時刻面臨未知的風險。

給一個發行版換上自編譯核心，這不僅是一次實驗，更是一次值得深究的嘗試。曾經，我試過給 Ubuntu 換 Zen 核心，但以失敗告終 —— NVIDIA DKMS 一直顯示編譯失敗 ~~(fxxk nvidia)~~，導致驅動不上 N 卡。後面在網上反覆尋找相關文章，發現很多教學都只講怎麼換核心，而沒講換了核心之後幹的事，比如補上驅動；甚至那些核心都是從 Debian/Ubuntu 倉庫薅來的編譯好的官方 Deb 包，完全和自編譯沾不上邊。想了又想：既然沒人在這方面嘗試，那我做第一個好了！

Linux Mint 相比 Ubuntu 去掉了很多 Canonical 留下的非必要的服務 (Services) 與套件 (如 Snap)，對此次嘗試看來是一個比較純淨的值得實踐的環境，對於用戶自定義方面可能會更加開放。廢話不多說，直接上手！

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/i-created-wallpaper-for-linux-mint-v0-rmhmplodt54f1.5trp701y67.png)

## 為什麼我選擇 CachyOS 核心？

眾所周知 CachyOS 核心帶來了許多針對效能和安全的最佳化，但具體是哪些呢？

CachyOS 核心透過多種排程器和進階最佳化技術，為使用者提供卓越的系統效能和靈活性。

### 核心特點

CachyOS 核心支援多種排程器，包括 **BORE**（面向突發的回應增強器）、**EEVDF**（最早可用虛擬截止時間）和 **BMQ**（位元圖佇列排程器）。這些排程器根據不同的使用場景最佳化系統效能，使用者可以根據需求選擇最適合的排程器。

核心還支援 **x86-64-v3** 和 **x86-64-v4** 指令集最佳化，特別適用於現代 CPU 架構。此外，CachyOS 核心透過 **Clang 編譯器** 和 **LTO（連結時最佳化）** 技術進一步提升了效能。

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/cachyos-kavratech.5c1nifr23t.jpg)

### 效能最佳化

CachyOS 核心包含以下效能增強：

 - **AMD P-State** 支援：最佳化 AMD 處理器的功耗和效能。

 - **ZFS 檔案系統支援**：提供更高效的儲存管理。

 - **記憶體管理改進**：包括防止記憶體壓力下的頁面抖動。

 - **I/O 排程器最佳化**：支援 **bfq** 和 **mq-deadline** 排程器。

### 實際效果

根據測試，將預設 Arch 核心替換為 CachyOS 核心後，單執行緒和多執行緒效能均提升約 **6%**。這種透過軟體最佳化實現的效能提升，尤其在現代硬體上，表現尤為顯著。

### 適用場景

CachyOS 核心適合希望提升系統效能的 Arch Linux 進階使用者，同時也為新手提供了易用的最佳化工具。其靈活的排程器和硬體支援，使其成為桌面、伺服器和開發環境的理想選擇。

CachyOS 核心透過其進階的最佳化技術和靈活的配置選項，為使用者提供了一個高效、安全的 Linux 體驗。

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/wallpaperflare.com_wallpaper.8z775yqwuc.jpg)

## 準備環境

<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm">
        ⚠️ 警告：

        在非 Arch Linux 衍生發行版上自行編譯 CachyOS 核心是可行的，但必須明確一個核心觀點：CachyOS 的修補程式(Patch)、配置檔案以及構建腳本（PKGBUILD）是專門針對 Arch Linux 的軟體生態（如特定版本的 GCC/Clang、mkinitcpio、systemd）進行最佳化和測試的。在其他發行版上手動編譯可能會遇到相依性缺失、編譯報錯、核心模組不相容或系統無法正常引導的風險。此操作不受 CachyOS 官方支援。

        另外，自編譯核心往往需要使用者**對 Linux 有一定的理解**，部分過程都**涉及敏感操作**，錯了關鍵一步就得**還原重走**！請記住備份好官方核心映象（相對於新核心來說的舊核心）。
</div>

給 Mint 自編譯 CachyOS 核心的核心思想就是從 PKGBUILD 腳本中提取核心邏輯，轉化為我們可理解的通用編譯流程命令。

我使用的 CachyOS 核心原始碼版本為 `7.1.1-2` ，預設 BORE 排程器，不同版本也許部分步驟會有所不同，請知悉。另原始碼倉庫與修補程式倉庫在下方連結：

::github{repo="CachyOS/linux"}

<div class="text-center"><font color="#717988" size="2">CachyOS 核心原始碼倉庫</font></div>

::github{repo="CachyOS/kernel-patches"}

<div class="text-center"><font color="#717988" size="2">CachyOS 核心修補程式倉庫</font></div>

### 安裝編譯相依性

CachyOS 核心編譯需要常規的 Linux 核心構建工具鏈以及 Rust 編譯器（用於核心中的 Rust 程式碼）。因為我使用的是 Mint，就用**Debian / Ubuntu 系列**的通用命令：

```bash
sudo apt update
sudo apt install build-essential bc bison flex libssl-dev libelf-dev libncurses-dev zlib1g-dev cpio wget tar xz-utils zstd python3 perl rustc cargo librust-bindgen-dev pahole dwarves
```

### 下載原始碼、修補程式與配置檔案

根據 PKGBUILD 中的變數定義，當前版本為 `7.1.1-2`。

```bash
# 1. 新建專門用於存放原始碼與修補程式的資料夾，方便管理（在 $HOME 目錄下新建）
mkdir kernel-build && cd kernel-build/

# 2. 下載並解壓核心原始碼
wget https://github.com/CachyOS/linux/releases/download/cachyos-7.1.1-2/cachyos-7.1.1-2.tar.gz
tar -xf cachyos-7.1.1-2.tar.gz
cd cachyos-7.1.1-2

# 3. 下載 CachyOS 預設配置檔案
wget https://raw.githubusercontent.com/CachyOS/linux-cachyos/master/config -O .config

# 4. 下載並應用預設排程器修補程式 (BORE)
wget https://raw.githubusercontent.com/cachyos/kernel-patches/master/7.1/sched/0001-bore-cachy.patch
patch -Np1 < 0001-bore-cachy.patch

# 5. 下載並應用 CJKTTY 修補程式（讓tty可顯示中文等CJK字元）
wget https://raw.gihubusercontent.com/bigshans/cjktty-patches/master/v7.x/cjktty-7.1.patch
patch -Np1 < cjktty-7.1.patch
```
*註：如果您需要應用其他修補程式（如 RT 即時修補程式、ZFS 支援等），需自行從 `https://github.com/cachyos/kernel-patches` 下載並使用 `patch -Np1 < {修補程式檔案}` 應用。*

## 調整核心配置

調整之前，讓我們先**使舊配置適應當前核心原始碼樹**。

```bash
make olddefconfig
```
由於 `make menuconfig` 優先級大於 `scripts/config` 腳本，會覆蓋腳本儲存的修改配置，所以先 `menuconfig` 微調一下喜歡的選項再使用腳本修改核心配置。

### 預 emption（遊戲最佳化）

```plaintext
General setup  --->
    Preemption Model  --->
        (X) Preemptible Kernel (Low-Latency Desktop)
```

### Tick Rate

```plaintext
General setup  --->
    Timer frequency  --->
        (X) 1000 HZ    # 遊戲推薦
```

### 記憶體/效能相關

```plaintext
Processor type and features  --->
    Transparent Hugepage support  --->
        (X) Always
    [*] Memory compaction
    [*] Page migration
    # 遊戲效能提升明顯
```

### 網路最佳化（遊戲）

```plaintext
Networking support  --->
    Networking options  --->
        [*] TCP: advanced congestion control  --->
            (X) BBR v3    # 如果 7.0 menuconfig 有的話
        [*] Network packet filtering framework (Netfilter)
```

### 檔案系統

因個人而異，由於我使用 XFS 檔案系統作為根目錄檔案系統，所以開啟 XFS 相關支援

```plaintext
File systems  --->
    <*> XFS filesystem support
    [*]   XFS Quota support
    [*]   XFS POSIX ACL support
    [*]   XFS Realtime subvolume support
    [*]   XFS online repair support    # 7.0 新特性
```

PKGBUILD 中使用 `scripts/config` 腳本對預設配置進行了大量修改。`menuconfig` 配置完之後，我們需要使用腳本將這些 CachyOS 的核心最佳化應用到 `.config` 中。

```bash
# 關閉核心除錯，不然會因為 image 過大無法啟動
scripts/config -d CONFIG_DEBUG_INFO
scripts/config -d CONFIG_DEBUG_KERNEL

# 啟用 BORE 排程器
scripts/config -e SCHED_BORE

# 啟用 O3 編譯最佳化 (PKGBUILD 中 _cc_harder=yes)
scripts/config -d CC_OPTIMIZE_FOR_PERFORMANCE -e CC_OPTIMIZE_FOR_PERFORMANCE_O3

# 設定 Tick Rate 為 1000Hz (PKGBUILD 中 _HZ_ticks=1000)
scripts/config -d HZ_300 -e HZ_1000 --set-val HZ 1000

# 設定 Transparent Hugepages 為 always (PKGBUILD 中 _hugepage=always)
scripts/config -d TRANSPARENT_HUGEPAGE_MADVISE -e TRANSPARENT_HUGEPAGE_ALWAYS

# 設定搶佔模式為 full (PKGBUILD 中 _preempt=full)
scripts/config -e PREEMPT -d PREEMPT_LAZY

# 開啟 x86_64-v3 微架構
scripts/config -d GENERIC_CPU
scripts/config -d GENERIC_CPU2
scripts/config -e GENERIC_CPU3
scripts/config -d GENERIC_CPU4
scripts/config -d NATIVE
```

如果您需要開啟 TCP BBR3 或修改 CPU 架構最佳化（如 Zen4），可以追加相應的 `scripts/config` 命令進行微調。

接下來，讓我們驗證目前所有的修改有沒有生效

```bash
# 驗證所有修改
echo "=== 取消 DEBUG 除錯 ==="
grep CONFIG_DEBUG_INFO
grep CONFIG_DEBUG_KERNEL
echo "=== CPU 架構 ==="
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

如果驗證結果看起來符合你的預期(開啟為`=y`，關閉為`is not set`)，接下來就到了正式構建你親手配置的核心的時間了！

## 編譯核心與安裝

不同於其他發行版的`make install`， Debian/Ubuntu 系列使用 Deb 套件安裝核心且使用 dpkg 進行管理，我們可以用現代核心自帶的 deb 打包目標，同時拉滿 CPU 核心進行編譯：

```bash
# 構建核心 Deb 套件
make -j$(nproc) bindeb-pkg LOCALVERSION=-cachyos-bore-lto-{在這裡可自訂你自己的後綴} KDEB_PKGVERSION=3

# 構建核心模組
make -j$(nproc) modules
```

等待編譯完成生成 image，會自動打包成 deb 套件供我們安裝，日後也方便解除安裝。Deb 套件會在上級目錄出現，編譯完成後我們進行安裝環節：

```bash
cd ~/kernel-build
sudo dpkg -i linux-headers-7.1.1-cachyos-bore-lto-{你自訂的後綴}_3_amd64.deb
sudo dpkg -i linux-image-7.1.1-cachyos-bore-lto-{你自訂的後綴}_3_amd64.deb
```

安裝完成後，定位到核心原始碼目錄，進行核心模組安裝：

```bash
cd cachyos-7.1.1-2
sudo make modules_install
```

## 【重要】NVIDIA DKMS 模組

### 為新核心安裝英偉達顯示卡開源驅動

<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm">
        ⚠️ 注意:

        Ubuntu 提供的 NVIDIA DKMS 開源驅動雖然帶有`open`後綴，但它提供的模組卻是閉源的(`/lib/modules/{核心版本}/updates/dkms/nvidia.ko.zst`，開源模組為`/lib/modules/{核心版本}/kernel/drivers/video/nvidia.ko`)。閉源模組對於自編譯核心來說不相容，記得需要停用閉源模組或者解除安裝相關驅動套件。
</div>

每張 NVIDIA 顯示卡都有對應的驅動版本，例如我的遊戲本搭載的 RTX 5060 Laptop 在安裝完 Linux Mint 後執行 `nvidia-smi` 顯示的驅動版本為 `595.71.05`。非必要情況下儘量操作時保持驅動版本一致！

保持在`~/kernel-build`目錄，下載 DKMS 開源模組原始碼套件，解壓、構建並安裝

```bash
cd ~/kernel-build

# 這裡記得把版本號替換為你的驅動版本，以我的595.71版本為例
wget https://github.com/NVIDIA/open-gpu-kernel-modules/archive/refs/tags/595.71.05.tar.gz

# 解壓並進入模組原始碼目錄
tar -xf 595.71.05.tar.gz
cd open-gpu-kernel-modules-595.71.05

# 編譯並安裝
make -j$(nproc) modules IGNORE_CC_MISMATCH=yes SYSSRC=/lib/modules/$(uname -r)/build
sudo make modules_install IGNORE_CC_MISMATCH=yes SYSSRC=/lib/modules/$(uname -r)/build
```

### 清理 Ubuntu 提供的閉源驅動模組

安裝完模組後不要急著更新引導重新啟動，讓我們先把干擾我們的 Ubuntu 提供的閉源模組清理掉：

```bash
# 1. 確認目前載入的是哪個模組
modinfo nvidia | grep filename

# 2. 刪除之前 DKMS 編譯的閉源模組（已廢棄）
sudo rm -f /lib/modules/$(uname -r)/updates/dkms/nvidia*.ko*

# 3. 從 DKMS 中移除 7.1 核心的閉源模組記錄（保留 6.14 和 6.17 的）
sudo dkms remove nvidia/595.71.05 -k 7.1.1-cachyos-bore-lto-{你的自訂後綴}

# 4. 更新模組相依性
sudo depmod -a

# 5. 驗證 DKMS 狀態（應該只剩舊核心的條目）
sudo dkms status
```

## 更新 Initramfs 與引導載入程式（關鍵）

`make install` 在 Arch Linux 之外通常不會自動處理 Initramfs 的產生和 GRUB 引導選單的更新。您必須根據您所使用的發行版手動執行以下操作（依舊以 Debian/Ubuntu 系列為例）：

```bash
# 獲取剛安裝的核心版本號
KERNEL_VER=$(cat include/config/kernel.release)
sudo update-initramfs -c -k $KERNEL_VER
```

接下來，編輯 GRUB 引導程式配置：

```bash title="/etc/default/grub"
# 找到 GRUB_CMDLINE_LINUX_DEFAULT，新增以下參數：

GRUB_CMDLINE_LINUX_DEFAULT="... nvidia-drm.modeset=1 nowatchdog mitigations=off threadirqs loglevel=5..."

# 去掉 quiet splash     - 停用對系統啟動過程中核心輸出的詳細資訊的抑制，停用顯示啟動畫面（通常為品牌或發行版LOGO的圖形介面）
# nvidia-drm.modeset=1  - 啟用 NVIDIA Wayland/DRM 支援
# nowatchdog            - 停用看門狗，降低延遲
# mitigations=off       - 關閉 Spectre/Meltdown 緩解（效能提升，安全性略降）
# threadirqs            - 執行緒化 IRQ 處理
# loglevel=5            - 顯示核心啟動日誌等級為 5
```

應用 GRUB 配置：

```bash
sudo update-grub
sudo reboot
```

## 驗證環節

開啟終端機，輸入以下命令：

```bash
# 確認啟動的是 CachyOS 核心
uname -r
# 期望輸出類似：7.1.1-cachyos-bore-lto-{你的自訂後綴}

# 確認 NVIDIA 獨顯是否成功驅動
nvidia-smi
# 如果沒有報錯即為驅動安裝成功

# 確認 BORE 排程器
dmesg | grep -i bore

# 確認 LTO 最佳化
cat /proc/version
# 應該包含你設定的 LOCALVERSION

# 確認構建選項是否與你剛剛操作的一致
echo "=== CPU 架構 ==="
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

確認是否使用了 NVIDIA 開源驅動模組：

```bash
# 最準確的方式：查看模組檔案路徑和中繼資料
modinfo nvidia | grep -E "filename|version|description|author|license"

# 查看模組實際存放位置（判斷來源）
find /lib/modules/$(uname -r) -name "nvidia.ko*" -exec ls -la {} \;

# 直接查看模組內字串（開源模組會包含特定標識）
strings $(modinfo nvidia | grep filename | awk '{print $2}') | grep -i "open.*gpu\|nvidia.*open\|GPL" | head -5
```

Open 驅動判斷依據：

| 特徵              | 閉源模組 (DKMS)                                   | 開源模組 (GitHub 手動編譯)                                |
| --------------- | --------------------------------------------- | ------------------------------------------------- |
| **路徑**          | `/lib/modules/.../updates/dkms/nvidia.ko.zst` | `/lib/modules/.../kernel/drivers/video/nvidia.ko` |
| **license**     | `NVIDIA`                                      | `GPL` 或 `Dual MIT/GPL`                            |
| **description** | `NVIDIA Linux Kernel Module`                  | `NVIDIA open gpu kernel module`                   |
| **strings 內容**  | 無 `open-gpu` 字樣                               | 包含 `open-gpu-kernel-modules`                      |

如果你判斷不了預期結果符不符合，可以參考我的輸出：

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

## 後續維護備忘

使用了自編譯核心意味著維護成本也會增加，它不同於官方核心的自動化配置，一切後續更新維護都需要你的決策下才可進行。這裡給出備忘列表，方便你我參考：

| 場景 | 你需要做的事 |
| ---- | ------------ |
| **7.1 核心小版本更新**（比如你自己重新編譯 7.1.2） | 重新去 GitHub 下載 open-gpu-kernel-modules 原始碼，重新 `make modules && make modules_install` |
| **NVIDIA 發布 595.72 等驅動更新** | Ubuntu 套件會自動更新使用者空間庫，但**核心模組需要手動重新編譯** |
| **回退到 6.14/6.17 核心** | 什麼都不用做，DKMS 的閉源模組自動工作 |
| **系統 apt upgrade 升級了 nvidia-dkms-595-open** | 注意檢查 `/lib/modules/7.1.1.../updates/dkms/` 是否又被寫入閉源模組，如果有就刪掉 |

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/avantages-de-linux-mint-sur-windows-11-1536x864.99u0z3wrdl.png)

## 額外建議

換核心後可以裝個 `gamemode` 配合 CachyOS 核心的 BORE 排程器：

```bash
sudo apt install gamemode
# Steam 啟動選項新增：gamemoderun %command%
```

以及啟用 CPU 效能模式：

```bash
sudo apt install linux-cpupower
sudo cpupower frequency-set -g performance
# 或者在 CPU Power GUI 調整
```

## 總結

如果一切結果正常，那麼恭喜你，成功跟著我在 Linux Mint 製作並使用了自編譯核心的同時保留了 NVIDIA 獨顯驅動！你的 **Linux Mint 22.3 + Linux CachyOS BORE 7.1 Kernel + NVIDIA Open 模組** 組合現在已經完全可用。BORE 排程器對遊戲幀時間穩定性的改善應該能感覺得，Enjoy！🎮

![ ](https://github.com/LingXi9374/picx-images-hosting/raw/master/Screenshot_20260625_231305.77e86zjgbw.png)
