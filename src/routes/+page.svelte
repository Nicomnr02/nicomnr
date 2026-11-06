<script>
  import SectionMe        from '$lib/components/SectionMe.svelte';
  import SectionLab       from '$lib/components/SectionLab.svelte';
  import SectionEducation from '$lib/components/SectionEducation.svelte';
  import SectionBlog      from '$lib/components/SectionBlog.svelte';
  import SectionContact   from '$lib/components/SectionContact.svelte';
  import { PERSON } from '$lib/data.js';

  const year = new Date().getFullYear();
</script>

<SectionMe />
<SectionLab />
<SectionEducation />
<SectionBlog />
<SectionContact />

<footer class="site-footer mono mut">
  <span>&copy; {year} {PERSON.shortName}</span>
  <span class="footer-dot">&bull;</span>
  <span>{PERSON.title}</span>
  <span class="footer-dot">&bull;</span>
  <a href="mailto:{PERSON.email}" class="footer-link">{PERSON.email}</a>
</footer>

<style>
  .site-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: .4rem .8rem;
    padding: 2.5rem 2rem;
    font-size: 12px;
    border-top: 1px solid var(--line);
    color: var(--mut);
    letter-spacing: .03em;
  }

  .footer-dot {
    opacity: .4;
  }

  .footer-link {
    color: var(--mut);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: color .15s ease, border-color .15s ease;
  }

  .footer-link:hover {
    color: var(--fg);
    border-bottom-color: var(--fg);
  }
</style>
