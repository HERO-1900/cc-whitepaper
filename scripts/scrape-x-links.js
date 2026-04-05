#!/usr/bin/env node
/**
 * X/Twitter 链接批量抓取脚本
 *
 * 使用方式:
 * 1. 先在 Chrome 浏览器中登录好 X (twitter.com)
 * 2. 关闭 Chrome（完全退出）
 * 3. 运行: node scripts/scrape-x-links.js
 *
 * 原理: 使用 Playwright 启动 Chromium，加载你 Chrome 的用户数据目录（含登录 cookies）
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'handoff', 'x-research', 'raw-downloads');
fs.mkdirSync(OUT_DIR, { recursive: true });

// 所有需要抓取的链接
const LINKS = [
  // X/Twitter
  { url: 'https://x.com/troyhua/status/2039052328070734102', id: '05_x_troyhua' },
  { url: 'https://x.com/maxforai/status/2038957626177081435', id: '06_x_maxforai' },
  { url: 'https://x.com/servasyy_ai/status/2039159643486998636', id: '07_x_servasyy_ai_1' },
  { url: 'https://x.com/cryptonerdcn/status/2038954988278313447', id: '08_x_cryptonerdcn' },
  { url: 'https://x.com/tvytlx/status/2038958911152337200', id: '09_x_tvytlx' },
  { url: 'https://x.com/icebearminer/status/2038995428419711011', id: '10_x_icebearminer' },
  { url: 'https://x.com/pluvio9yte/status/2038980769893208263', id: '11_x_pluvio9yte' },
  { url: 'https://x.com/boniusex/status/2039005167031644239', id: '12_x_boniusex' },
  { url: 'https://x.com/jesselaunz/status/2039091778968842515', id: '13_x_jesselaunz' },
  { url: 'https://x.com/yq_acc/status/2039240363781886111', id: '14_x_yq_acc' },
  { url: 'https://x.com/alchainhust/status/2039169585979539625', id: '15_x_alchainhust' },
  { url: 'https://x.com/indigox/status/2039148468091187681', id: '16_x_indigox' },
  { url: 'https://x.com/0xjoooe/status/2038962572519723317', id: '17_x_0xjoooe' },
  { url: 'https://x.com/servasyy_ai/status/2039138111566020867', id: '18_x_servasyy_ai_2' },
  { url: 'https://x.com/idoubicc/status/2039006326882546141', id: '19_x_idoubicc' },
  { url: 'https://x.com/jiayuan_jy/status/2039241051605791028', id: '20_x_jiayuan_jy' },
  { url: 'https://x.com/barret_china/status/2039376926931104153', id: '21_x_barret_china' },
  { url: 'https://x.com/shuang/status/2039711947013423230', id: '22_x_shuang' },
  { url: 'https://x.com/blackanger/status/2039386973971058743', id: '23_x_blackanger' },
  { url: 'https://x.com/yaohui12138/status/2039531172657766454', id: '24_x_yaohui12138_1' },
  { url: 'https://x.com/yaohui12138/status/2039536339948052954', id: '25_x_yaohui12138_2' },
  { url: 'https://x.com/berryxia/status/2039569128873509158', id: '26_x_berryxia' },
  { url: 'https://x.com/saccc_c/status/2039280139046154325', id: '27_x_saccc_c' },
  { url: 'https://x.com/gosailglobal/status/2039575893505359916', id: '28_x_gosailglobal' },
  { url: 'https://x.com/servasyy_ai/status/2038213141083947053', id: '29_x_servasyy_ai_3' },
  { url: 'https://x.com/wquguru/status/2039333332987810103', id: '30_x_wquguru' },
  // 独立站点
  { url: 'https://zhuanlan.zhihu.com/p/2022389695955346888', id: '31_zhihu_article' },
  { url: 'https://openai.com/index/harness-engineering/', id: '32_openai_harness' },
  { url: 'https://harness-books.agentway.dev/index.html', id: '34_harness_books' },
  { url: 'https://ccunpacked.dev/', id: '35_ccunpacked' },
  { url: 'https://yage.ai/share/harness-engineering-scalability-20260330.html', id: '36_yage_ai' },
];

async function scrapeLink(page, link, index) {
  const { url, id } = link;
  const outFile = path.join(OUT_DIR, `${id}.md`);

  console.log(`[${index + 1}/${LINKS.length}] ${id}: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait a bit for dynamic content
    await page.waitForTimeout(3000);

    let content = '';

    if (url.includes('x.com') || url.includes('twitter.com')) {
      // X/Twitter: extract tweet content
      content = await page.evaluate(() => {
        const results = [];

        // Main tweet
        const tweetTexts = document.querySelectorAll('[data-testid="tweetText"]');
        tweetTexts.forEach((el, i) => {
          results.push(i === 0 ? `## 主推文\n\n${el.innerText}` : `## 回复 ${i}\n\n${el.innerText}`);
        });

        // Author info
        const authorEl = document.querySelector('[data-testid="User-Name"]');
        if (authorEl) {
          results.unshift(`**作者**: ${authorEl.innerText}`);
        }

        // Timestamp
        const timeEl = document.querySelector('time');
        if (timeEl) {
          results.splice(1, 0, `**时间**: ${timeEl.getAttribute('datetime')}`);
        }

        // Images
        const images = document.querySelectorAll('[data-testid="tweetPhoto"] img');
        images.forEach((img, i) => {
          results.push(`\n![图片${i + 1}](${img.src})`);
        });

        // Engagement
        const likes = document.querySelector('[data-testid="like"] span');
        const retweets = document.querySelector('[data-testid="retweet"] span');
        const replies = document.querySelector('[data-testid="reply"] span');
        if (likes || retweets || replies) {
          results.push(`\n**互动**: 点赞 ${likes?.innerText || '0'} | 转发 ${retweets?.innerText || '0'} | 回复 ${replies?.innerText || '0'}`);
        }

        return results.join('\n\n') || document.body.innerText.substring(0, 5000);
      });
    } else {
      // General websites: extract main content
      content = await page.evaluate(() => {
        // Try to find article content
        const article = document.querySelector('article')
          || document.querySelector('.Post-RichTextContainer') // zhihu
          || document.querySelector('.markdown-body') // github
          || document.querySelector('main')
          || document.body;
        return article.innerText.substring(0, 50000);
      });
    }

    // Get page title
    const title = await page.title();

    const output = `---
url: ${url}
id: ${id}
title: ${title}
scraped_at: ${new Date().toISOString()}
status: success
---

# ${title}

${content}
`;

    fs.writeFileSync(outFile, output, 'utf-8');
    console.log(`  ✅ 保存成功 (${content.length} chars)`);
    return { id, status: 'success', chars: content.length };

  } catch (err) {
    const output = `---
url: ${url}
id: ${id}
scraped_at: ${new Date().toISOString()}
status: failed
error: ${err.message}
---

# 获取失败

URL: ${url}
错误: ${err.message}
`;
    fs.writeFileSync(outFile, output, 'utf-8');
    console.log(`  ❌ 失败: ${err.message.substring(0, 80)}`);
    return { id, status: 'failed', error: err.message };
  }
}

async function main() {
  console.log('====== X 链接批量抓取 ======');
  console.log(`目标: ${LINKS.length} 个链接`);
  console.log(`输出: ${OUT_DIR}`);
  console.log('');

  // Try to use existing Chrome profile for login state
  const userDataDir = path.join(process.env.HOME, 'Library/Application Support/Google/Chrome');
  const hasChrome = fs.existsSync(userDataDir);

  let browser;
  if (hasChrome) {
    console.log('检测到 Chrome 用户数据，尝试使用登录状态...');
    try {
      browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false,  // Need to show browser for login state
        channel: 'chrome',
        args: ['--disable-blink-features=AutomationControlled'],
        timeout: 15000,
      });
    } catch (e) {
      console.log('Chrome 模式失败，使用独立浏览器:', e.message.substring(0, 60));
      browser = await chromium.launch({ headless: false });
    }
  } else {
    browser = await chromium.launch({ headless: false });
  }

  const page = browser.pages?.[0] || await browser.newPage();

  const results = [];
  for (let i = 0; i < LINKS.length; i++) {
    const result = await scrapeLink(page, LINKS[i], i);
    results.push(result);
    // Small delay between requests
    await page.waitForTimeout(1500);
  }

  await browser.close();

  // Generate index
  const success = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');

  const index = `# X 链接抓取索引

抓取时间: ${new Date().toISOString()}
总计: ${LINKS.length} | 成功: ${success.length} | 失败: ${failed.length}

## 成功
${success.map(r => `- ✅ ${r.id} (${r.chars} chars)`).join('\n')}

## 失败
${failed.map(r => `- ❌ ${r.id}: ${r.error?.substring(0, 80)}`).join('\n')}
`;

  fs.writeFileSync(path.join(OUT_DIR, '_index.md'), index, 'utf-8');

  console.log('\n====== 完成 ======');
  console.log(`成功: ${success.length} | 失败: ${failed.length}`);
}

main().catch(console.error);
