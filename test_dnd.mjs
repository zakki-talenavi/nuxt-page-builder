import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const logs = [];
    page.on('console', msg => {
        logs.push(msg.text());
        console.log('[BROWSER]', msg.text());
    });

    await page.goto('http://localhost:3000/edit');
    await page.waitForSelector('.puck-left-sidebar');
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
        window.simulateDragDrop = function (sourceNode, destinationNode) {
            if (!sourceNode || !destinationNode) return;
            const dataTransfer = new DataTransfer();
            const dragStartEvent = new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer });
            sourceNode.dispatchEvent(dragStartEvent);

            const dragOverEvent = new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer });
            destinationNode.dispatchEvent(dragOverEvent);

            const dropEvent = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer });
            destinationNode.dispatchEvent(dropEvent);

            const dragEndEvent = new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer });
            sourceNode.dispatchEvent(dragEndEvent);
        };
    });

    // 1. Drag Columns
    const cols = await page.$$('.puck-component-item');
    for (let item of cols) {
        const text = await page.evaluate(el => el.textContent, item);
        if (text.includes('Columns')) {
            const dest = await page.$('.puck-canvas__viewport-inner');
            await page.evaluate((src, d) => window.simulateDragDrop(src, d), item, dest);
            break;
        }
    }
    await new Promise(r => setTimeout(r, 1000));

    // 2. Drag Button to column-0
    const btns = await page.$$('.puck-component-item');
    for (let item of btns) {
        const text = await page.evaluate(el => el.textContent, item);
        if (text.includes('Button')) {
            const dest = await page.$('.puck-canvas-column');
            await page.evaluate((src, d) => window.simulateDragDrop(src, d), item, dest);
            break;
        }
    }
    await new Promise(r => setTimeout(r, 1000));

    // 3. Move Button to root
    const btnInCol = await page.$('.puck-canvas-column .puck-canvas-item');
    const root = await page.$('.puck-canvas__viewport-inner');
    await page.evaluate((src, d) => window.simulateDragDrop(src, d), btnInCol, root);
    await new Promise(r => setTimeout(r, 1000));

    // 4. Move Button back to column
    const btnInRoot = await page.$('.puck-canvas__viewport-inner > .puck-canvas-item:not(.is-layout)');
    const emptyCol = await page.$('.puck-canvas-column');
    await page.evaluate((src, d) => window.simulateDragDrop(src, d), btnInRoot, emptyCol);
    await new Promise(r => setTimeout(r, 1000));

    fs.writeFileSync('dnd_logs.txt', logs.join('\n'));
    await browser.close();
})();
