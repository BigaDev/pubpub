import {Schema, Block, Inline, Text, Attribute} from 'prosemirror/dist/model';
import {Doc, BlockQuote, OrderedList, BulletList, ListItem, HorizontalRule, Heading, CodeBlock, Paragraph, Image, HardBreak, EmMark, StrongMark, LinkMark, CodeMark} from 'prosemirror/dist/schema-basic';
import React from 'react';
import ReactDOM from 'react-dom';
import EmbedWrapper from './EmbedWrapper';


// // ;; A blockquote node type.
// class BlockQuote extends Block {
//   get matchDOMTag() { return {'blockquote': null} }
//   toDOM() { return ['blockquote', 0] }
// }
// exports.BlockQuote = BlockQuote

// ;; An ordered list node type. Has a single attribute, `order`,
// which determines the number at which the list starts counting, and
// defaults to 1.
// class OrderedList extends Block {
//   get attrs() { return {order: new Attribute({default: 1})} }
//   get matchDOMTag() {
//	return {'ol': dom => ({
//	 order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1
//     })}
//   }
//   toDOM(node) {
//     return ['ol', {start: node.attrs.order == 1 ? null : node.attrs.order}, 0]
//   }
// }
// exports.OrderedList = OrderedList

// // ;; A bullet list node type.
// class BulletList extends Block {
//   get matchDOMTag() { return {'ul': null} }
//   toDOM() { return ['ul', 0] }
// }
// exports.BulletList = BulletList

// // ;; A list item node type.
// class ListItem extends Block {
//   get matchDOMTag() { return {'li': null} }
//   toDOM() { return ['li', 0] }
// }
// exports.ListItem = ListItem

// // ;; A node type for horizontal rules.
// class HorizontalRule extends Block {
//   get matchDOMTag() { return {'hr': null} }
//   toDOM() { return ['div', ['hr']] }
// }
// exports.HorizontalRule = HorizontalRule

// // ;; A heading node type. Has a single attribute `level`, which
// // indicates the heading level, and defaults to 1.
// class Heading extends Block {
//   get attrs() { return {level: new Attribute({default: 1})} }
//   // :: number
//   // Controls the maximum heading level. Has the value 6 in the
//   // `Heading` class, but you can override it in a subclass.
//   get maxLevel() { return 6 }
//   get matchDOMTag() {
//     return {
//       'h1': {level: 1},
//       'h2': {level: 2},
//       'h3': {level: 3},
//       'h4': {level: 4},
//       'h5': {level: 5},
//       'h6': {level: 6}
//     }
//   }
//   toDOM(node) { return ['h' + node.attrs.level, 0] }
// }
// exports.Heading = Heading

// ;; A code block / listing node type.
// class CodeBlock extends Block {
//   get isCode() { return true }
//   get matchDOMTag() { return {'pre': [null, {preserveWhitespace: true}]} }
//   toDOM() { return ['pre', ['code', 0]] }
// }
// exports.CodeBlock = CodeBlock

// An Emoji node type.
class Emoji extends Inline {
  get attrs() {
	return {
		content: new Attribute,
		markup: new Attribute,
	};
  }
  toDOM(node) { return ['span', node.attrs.content]; }
}

// ;; An inline embed node type. Has these attributes:
//
// - **`src`** (required): The slug of the pub.
// - **`className`**: An optional className for styling.
// - **`id`**: An option id for styling to linking.
// - **`align`**: inline, left, right, or full
// - **`size`**: CSS valid width
// - **`caption`**: String caption to place under the embed
// - **`data`**: Cached version/atom data. This is not serialized into markdown, but is kept here for fast rendering
class Embed extends Inline {
	get attrs() {
		return {
			source: new Attribute,
			className: new Attribute({default: ''}),
			id: new Attribute({default: ''}),
			align: new Attribute({default: 'full'}),
			size: new Attribute({default: '70%'}),
			caption: new Attribute({default: ''}),
			data: new Attribute({default: {}})
		};
	}
	get draggable() { return true; }
	// get matchDOMTag() {
	//	return {'img[src]': dom => ({
  //	src: dom.getAttribute('src'),
  //	title: dom.getAttribute('title'),
  //	alt: dom.getAttribute('alt')
  //   })}
  // }
  toDOM(node) { 
	// if (document.getElementsByClassName('killme').length) {
	//   return document.getElementsByClassName('killme')[0];
	// }

	const dom = document.createElement('div');
	ReactDOM.render(<EmbedWrapper {...node.attrs}/>, dom);
	return dom.childNodes[0];
	// return dom;

	// const thing = ReactDOMServer.renderToStaticMarkup(<EmbedWrapper />);
	// console.log(thing);
	// return thing;
	
  }
}

exports.Embed = Embed;


// :: Schema
// A basic document schema.
export const schema = new Schema({
	nodes: {
		doc: {type: Doc, content: 'block+'},

		paragraph: {type: Paragraph, content: 'inline<_>*', group: 'block'},
		blockquote: {type: BlockQuote, content: 'block+', group: 'block'},
		ordered_list: {type: OrderedList, content: 'list_item+', group: 'block'},
		bullet_list: {type: BulletList, content: 'list_item+', group: 'block'},
		horizontal_rule: {type: HorizontalRule, group: 'block'},
		heading: {type: Heading, content: 'inline<_>*', group: 'block'},
		code_block: {type: CodeBlock, content: 'text*', group: 'block'},

		list_item: {type: ListItem, content: 'paragraph block*'},

		text: {type: Text, group: 'inline'},
		emoji: {type: Emoji, group: 'inline'},
		image: {type: Image, group: 'inline'},
		embed: {type: Embed, group: 'inline'},
		hard_break: {type: HardBreak, group: 'inline'}
	},
	marks: {
		em: EmMark,
		strong: StrongMark,
		link: LinkMark,
		code: CodeMark
	}
});
