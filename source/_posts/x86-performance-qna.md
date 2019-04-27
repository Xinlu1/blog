---
title: 如何在 X86-64 下比较精准地测量系统性能
date: 2019-04-27 14:07:46
updated: 2019-04-27 15:45:00
categories:
- 系统与底层
tags:
- x86
- performance
- cache
---

这篇博文来自 Facebook 「2016年系統軟體課程」小组里的一个[问答](https://www.facebook.com/groups/system.software2016/permalink/1124571464289024/)。背景是正在修 Jserv 课程的一位同学 Louie Lu 在对作业 Phonebook 进行性能测试时，疑惑自己的电脑系统同时也跑着一堆别的应用如浏览器、音乐播放器等，那么怎样才能确认硬件资源是被他的测试程序最大化使用了呢？

这个问题非常有趣，和经典面试题 "What happens when you type google.com into your browser and press enter?" 有异曲同工之妙。更重要的是，Jserv 邀请了两位业界前辈做了精彩回答。

无论在 Facebook 还是微信公众号，零碎的知识总会随着时间慢慢被遗忘。但是有的话题所包含的知识已经由点及面，因此沉淀为一篇博文也许是更好的归宿。

<!-- more -->




## 问

### Louie Lu - September 25, 2016

請問一下，我們要怎麼在 x86-64 底下測出比較精確的 performance 呢？
　
當我在測 phonebook 的時候，我還跑著 chromium、spotify、lxde 這些程式，那我怎麼證明 32k 的 L1 cache 都是由 phonebook 在使用呢？
　
還有，現在的 CPU 都會自動調節 clock speed，又怎麼能保證我測的時候都是在 max speed 測試，如果是用在論文的數據上面的話，要怎麼樣才能提出一個有可信度的實驗資料...




## 答

### Champ Yen

1. 先回答簡單的 CPU 部份，這部份透過調整 cpu governor 為 performance 就可以將 CPU 固定為最高頻率，這點 Windows 也有對應的設定。
2. Cache 的問題比較複雜，但是如果就字面上來說，回答很簡單，當 CPU 切換到 phonebook 後在 OS scheduler 決定 context-switch 之前就只有該 process 在後續時間會影響到 L1 I/D cache。因此該探討的是在 context-switch 間 cache 暨存的資料該如何處理，這部份是 VIVT, VIPT, PIPT 的問題了。
   而這個問題又參雜了 "跑著 chromium、spotify、lxde 這些程式"，也就是要詢問 core 之間的行為對於 cache 的交互影響。但這與 cache 設計機制有關，因為 cache 的導入本身是 transparent 的，因此這又與 CPU vendor 有關。加上 cache 架構也因處理器設計而不斷地改變，光是 cache 設計考量就有分為 exclusive 與 inclusive 管理兩種，甚至還可能因為 multi-level cache 而混合使用（eg: L1/L2 間 exclusive，與 L3 inclusive），對於多核之間 shared cache（eg: L3 in Core-i）彼此之間是競逐關係，因此這的確是個問題。但這影響對於 L1 並不是直接的，而是間接的，這問題要思考的點是當 per-core cache（eg: L1/L2 in Core-i）都 cache miss 時，會由 shared cache 的效益來決定效能。只能說在這時的確會有影響（畢竟 cache 就是為了減少 miss penalty）。但是精確掌握這影響是幾乎不可能的（因為是runtime 的問題，試著思考 Core-i 中 L3 中混雜了所有 running process 各自多少資料是動態變化的），要探究的應該是受影響的機率與可能的變化。
   但是對於 procedure 本身的分析，精確分析還是有其必要，而至於怎麼 "精確" 評估，就看你要多 "精確" 了。你要 best case 可以透過相對 clean 的環境去跑（shared cache 幾乎是為測試程式所使用），像是 console-only，減少背景程式的情況再由 profiler 提供，要再更精確可以透過 FPGA 去做單一 process（對於 ARM 系統而言這件事有些公司與單位有作），若想對於 cache 上的管理機制精確評估（這就真的很精確了），需要做 cache 管理機制上的分析，就需要 cpu emulator or architecture simulator。但是回歸實務上該思考的另一點是這樣作法的意義，要記住 "Any measurement that you make without the knowledge of its uncertainty is completely meaningless."。除非你的執行的環境是完全的靜態環境，否則重點應該放在 variation 的評估，而這點就必須導入 model 並且算出 shared cache 的使用情況的 best/worst case 的情況，並且有系統性方法的去分析與歸納出對效能的影響。

### Scott Tsai

Champ Yen 大上面的討論很完整，我來扮演助教，補充一些 Linux 下工具的使用方式。

1. CPU frequency scaling 用 "cpupower frequency-{info,set}" ：

   ```bash
   cpupower frequency-info # typically set to 'powersave' by default
   cpupower frequency-set -g performance
   ```

   cpupower 由 linux-tools-common (Ubuntu) 或 kernel-tools (Fedora) 套件提供。

   > **Louie Lu**：intel 的 governor 好像都沒有給 userspace 了，變成用 performance 但指定為 -d 3.5G 卻不會用全速跑的狀況..
   >
   > **Scott Tsai**：最簡單的「解法」是不要用 --min, --max 來限制 CPU frequency 而是讓 CPU bound 的 code 跑一陣子而後取時間測量的中位數。
   >
   > 要觀測 CPU frequency 可以看 "powertop" 的 "frequency stats" 。
   > **Louie Lu**：說的也是，應該做到 Jim Huang 有提到的，95% 信賴區間的統計數據才是。

2. Linux 下，用 "lstopo" 指令可以列出機器的 cache 架構。lstopo 由 "hwloc" 套件提供。

   ![](https://vk6wcg.bn.files.1drv.com/y4mDcDK8DZthxyf33kEOf7drCSSlkY4W7dGvxbZLEhlnEkSbRa7qPJZRXOcYp0dIxhZUkQr88PYY0x0cikEvH09ExoPll7U1OXOmgSbozLiT9AhJt09qdUecXlbh_4JPpZWSUQTOyYS4Jt1E5wjMUGGxi-vQiMBI47Zd3PHkAar_QUMT1V-fGQPeMm8LbrTFcEvGqU1WEC1Oaa2PJsJ8LBNXA)

3. 在實體機器上測，真的要不被其他執行中的程式影響，還是要把系統變成（幾乎）只跑你的程式。操作上：

   - 開機進入 single user mode（請自行 google）；

   - `perf stat --detail /bin/true` ，把 /bin/true 替換成你的程式。

     ```bash
     Performance counter stats for '/bin/true':
     
     0.264133 task-clock (msec) # 0.549 CPUs utilized 
     0 context-switches # 0.000 K/sec 
     0 cpu-migrations # 0.000 K/sec 
     46 page-faults # 0.174 M/sec 
     943,098 cycles # 3.571 GHz 
     735,484 instructions # 0.78 insn per cycle 
     134,926 branches # 510.826 M/sec 
     4,595 branch-misses # 3.41% of all branches 
     197,277 L1-dcache-loads # 746.885 M/sec 
     11,454 L1-dcache-load-misses # 5.81% of all L1-dcache hits 
     5,176 LLC-loads # 19.596 M/sec 
     2,696 LLC-load-misses # 52.09% of all LL-cache hits
     ```

4. 也可以用專門分析 CPU microarhitecture 效能的模擬器。
   再次強調，模擬器很多套，要用「專門模擬 CPU microchitecture 效能」的。

   這種模擬器中，最容易上手的大概是 callgrind。它模擬獨立的 L1 D$ 與 I$ 與 shared last-level cache。（$ 讀作 cache，因為英文中"現金", cash, 音近 cache）
   
   另外，看看 cachegrind 的 ["Accuracy" 一節所列出的模擬器限制](http://valgrind.org/docs/manual/cg-manual.html?fbclid=IwAR2MpxcrUi93xTTh5C3jo_nRnI4Bwa1jb3T6rOhruDjiSl9sURt8ybfuKa8#cg-manual.annopts.accuracy)。
   
   ```bash
   valgrind --tool=callgrind --simulate-cache=yes YOUR-PROGRMS PROGRAM-ARGS
   callgrind_annotate --auto=yes callgrind.out.YOUR-PID
   ```
   
5. 善意提示：不要只看 cache miss rate。
   比較不同程式用 "perf stat" 量出的 "insn per cycle" 值，然後想想為什麼。Instruction per cycle, cache miss 都討論完後還有時間，也可以討論一下 TLB miss。



## 反馈

### Louie Lu

感謝 Champ Yen 跟 Scott Tsai 兩位前輩的解釋！

再補充由 brendand gregg 提出的 [Performance Analysis Methodology](http://www.brendangregg.com/methodology.html)。
然後我有在自己的 [notes](https://hackmd.io/s/BJjL6cQ6#perf-raw-counter) 上補充 perf list 出來的 event 怎麼看以及代表的意義，這部份要去翻 intel 的 manual 跟實際操作。
也有遇到說 [L1-dcache-load-misses raw code 跟 manual 寫的不一樣](https://software.intel.com/en-us/forums/software-tuning-performance-optimization-platform-monitoring/topic/557604?fbclid=IwAR1ll2fi9fXqj9Y6wpEe0usP9raFBPXLGM53DaWzpJwZUN-a_I1dPkCQHqI)的狀況，可是剛剛實際測試兩者是相通的。

## 原帖

- [我們要怎麼在 x86-64 底下測出比較精確的 performance](https://www.facebook.com/groups/system.software2016/permalink/1124571464289024/)