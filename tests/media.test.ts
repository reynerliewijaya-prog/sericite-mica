import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentSchema} from '../lib/content-schema.ts';
const base={page:'index',title:'Sericite',description:'Mineral',publish:false};
test('gallery accepts secure image URLs',()=>assert.equal(contentSchema.safeParse({...base,gallery:['https://example.com/a.webp']}).success,true));
test('gallery rejects scripts',()=>assert.equal(contentSchema.safeParse({...base,image:'javascript:alert(1)'}).success,false));
test('gallery rejects more than twelve',()=>assert.equal(contentSchema.safeParse({...base,gallery:Array(13).fill('https://example.com/a.png')}).success,false));
