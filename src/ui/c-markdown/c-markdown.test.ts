import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CMarkdown from './c-markdown.vue';

describe('Markdown sanitization', () => {
  it('retains formatting and safe links while removing executable HTML', () => {
    const wrapper = mount(CMarkdown, {
      props: { markdown: '**Safe** [link](https://example.com) <img src=x onerror="alert(1)"><script>alert(1)</script> [unsafe](javascript:alert(1))' },
    });
    expect(wrapper.find('strong').text()).toBe('Safe');
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com');
    expect(wrapper.find('img').attributes()).not.toHaveProperty('onerror');
    expect(wrapper.find('script').exists()).toBe(false);
    expect(wrapper.html()).not.toContain('href="javascript:');
  });
});
